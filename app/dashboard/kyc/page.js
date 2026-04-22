"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock3,
  FileBadge2,
  FileText,
  ShieldCheck,
  Upload,
  UserRound,
  WalletCards,
  Lock,
} from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  idType: "Driver's License",
  idNumber: "",
  ssnLast4: "",
};

const WITHDRAWAL_PLANS = [
  { id: "plan-45000", amount: 45000, label: "$45,000" },
  { id: "plan-50000", amount: 50000, label: "$50,000" },
  { id: "plan-55000", amount: 55000, label: "$55,000" },
  { id: "plan-60000", amount: 60000, label: "$60,000" },
  { id: "plan-65000", amount: 65000, label: "$65,000" },
  { id: "plan-75000", amount: 75000, label: "$75,000" },
];

const PLAN_LOCK_HOURS = 48;
const PLAN_LOCK_MS = PLAN_LOCK_HOURS * 60 * 60 * 1000;

function getStepStatusStyles(status) {
  if (status === "completed") {
    return {
      badge: "border border-green-200 bg-green-50 text-green-700",
      icon: CheckCircle2,
      dot: "bg-green-500",
    };
  }

  if (status === "in-progress") {
    return {
      badge: "border border-amber-200 bg-amber-50 text-amber-700",
      icon: Clock3,
      dot: "bg-amber-500",
    };
  }

  return {
    badge: "border border-[#e9e1d5] bg-[#faf8f4] text-[#6e695f]",
    icon: AlertCircle,
    dot: "bg-[#b8afa2]",
  };
}

function getTimestampMillis(value) {
  if (!value) return null;

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().getTime();
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === "string" || typeof value === "number") {
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function formatRemainingTime(ms) {
  if (!ms || ms <= 0) return "Unlocked";

  const totalMinutes = Math.ceil(ms / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ") || "Less than 1m";
}

export default function KycPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState(null);

  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  const [kycStatus, setKycStatus] = useState("not_started");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planSelectedAt, setPlanSelectedAt] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const filledFieldsCount = useMemo(() => {
    return Object.values(formData).filter(
      (value) => String(value).trim() !== ""
    ).length;
  }, [formData]);

  const completionPercent = useMemo(() => {
    const totalFields = Object.keys(formData).length + 3; // +2 docs + 1 plan
    let completed = filledFieldsCount;

    if (governmentIdFile) completed += 1;
    if (proofOfAddressFile) completed += 1;
    if (selectedPlan) completed += 1;

    return Math.round((completed / totalFields) * 100);
  }, [filledFieldsCount, formData, governmentIdFile, proofOfAddressFile, selectedPlan]);

  const planLockRemainingMs = useMemo(() => {
    const selectedAtMs = getTimestampMillis(planSelectedAt);
    if (!selectedAtMs) return 0;

    const unlockAt = selectedAtMs + PLAN_LOCK_MS;
    const remaining = unlockAt - currentTime;
    return remaining > 0 ? remaining : 0;
  }, [planSelectedAt, currentTime]);

  const isPlanLocked = !!selectedPlan && planLockRemainingMs > 0;

  const verificationSteps = useMemo(() => {
    const hasIdentityBasics =
      formData.firstName &&
      formData.lastName &&
      formData.dateOfBirth &&
      formData.phone &&
      formData.email;

    const hasAddress =
      formData.addressLine1 &&
      formData.city &&
      formData.state &&
      formData.zipCode;

    const hasGovId = formData.idType && formData.idNumber && governmentIdFile;
    const hasAddressDoc = proofOfAddressFile;
    const hasPlan = !!selectedPlan;

    return [
      {
        title: "Personal Information",
        description:
          "Your legal name, date of birth, phone number, and contact email.",
        status: hasIdentityBasics ? "completed" : "in-progress",
      },
      {
        title: "Residential Address",
        description:
          "Your current residential address, city, state, and ZIP code.",
        status: hasAddress ? "completed" : "pending",
      },
      {
        title: "Identity Documents",
        description:
          "A government-issued ID and a valid proof of address document.",
        status:
          hasGovId && hasAddressDoc
            ? "completed"
            : hasGovId || hasAddressDoc
            ? "in-progress"
            : "pending",
      },
      {
        title: "Withdrawal Plan Selection",
        description:
          "A withdrawal plan must be selected before your KYC submission is finalized.",
        status: hasPlan ? "completed" : "pending",
      },
    ];
  }, [formData, governmentIdFile, proofOfAddressFile, selectedPlan]);

  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.dateOfBirth.trim() &&
      formData.phone.trim() &&
      formData.email.trim() &&
      formData.addressLine1.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.zipCode.trim() &&
      formData.idType.trim() &&
      formData.idNumber.trim() &&
      formData.ssnLast4.trim().length === 4 &&
      governmentIdFile &&
      proofOfAddressFile &&
      selectedPlan
    );
  }, [formData, governmentIdFile, proofOfAddressFile, selectedPlan]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadExistingKyc() {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setFeedback({
            type: "error",
            text: "Unable to verify your account session.",
          });
          setLoadingPage(false);
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoadingPage(false);
          return;
        }

        const userData = userSnap.data();
        const savedKyc = userData?.kyc;

        if (savedKyc) {
          setFormData((prev) => ({
            ...prev,
            firstName: savedKyc.firstName || "",
            lastName: savedKyc.lastName || "",
            middleName: savedKyc.middleName || "",
            dateOfBirth: savedKyc.dateOfBirth || "",
            phone: savedKyc.phone || "",
            email: savedKyc.email || "",
            addressLine1: savedKyc.addressLine1 || "",
            addressLine2: savedKyc.addressLine2 || "",
            city: savedKyc.city || "",
            state: savedKyc.state || "",
            zipCode: savedKyc.zipCode || "",
            idType: savedKyc.idType || "Driver's License",
            idNumber: savedKyc.idNumber || "",
            ssnLast4: savedKyc.ssnLast4 || "",
          }));

          if (savedKyc.governmentIdFileName) {
            setGovernmentIdFile({ name: savedKyc.governmentIdFileName });
          }

          if (savedKyc.proofOfAddressFileName) {
            setProofOfAddressFile({ name: savedKyc.proofOfAddressFileName });
          }

          if (savedKyc.withdrawalPlan) {
            setSelectedPlan(savedKyc.withdrawalPlan);
          }

          if (savedKyc.withdrawalPlanSelectedAt) {
            setPlanSelectedAt(savedKyc.withdrawalPlanSelectedAt);
          }

          setKycStatus(userData?.kycStatus || savedKyc.status || "not_started");
        }
      } catch (error) {
        console.error("Failed to load existing KYC:", error);
        setFeedback({
          type: "error",
          text: "Failed to load your existing KYC details.",
        });
      } finally {
        setLoadingPage(false);
      }
    }

    loadExistingKyc();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ssnLast4") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      return;
    }

    if (name === "zipCode") {
      const cleaned = value.replace(/[^\d-]/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGovernmentIdUpload = (e) => {
    const file = e.target.files?.[0] || null;
    setGovernmentIdFile(file);
  };

  const handleProofOfAddressUpload = (e) => {
    const file = e.target.files?.[0] || null;
    setProofOfAddressFile(file);
  };

  const handleSelectPlan = async (plan) => {
    if (isPlanLocked && selectedPlan?.id !== plan.id) {
      setFeedback({
        type: "error",
        text: `Your selected withdrawal plan is locked for ${PLAN_LOCK_HOURS} hours. You can change it again in ${formatRemainingTime(
          planLockRemainingMs
        )}.`,
      });
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setFeedback({
          type: "error",
          text: "Unable to verify your account session.",
        });
        return;
      }

      setSavingPlan(true);
      setFeedback({ type: "", text: "" });

      const userRef = doc(db, "users", currentUser.uid);

      await setDoc(
        userRef,
        {
          kyc: {
            withdrawalPlan: plan,
            withdrawalPlanSelectedAt: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSelectedPlan(plan);
      setPlanSelectedAt(new Date());
      setFeedback({
        type: "success",
        text: `${plan.label} withdrawal plan selected successfully. It is now locked for ${PLAN_LOCK_HOURS} hours.`,
      });
    } catch (error) {
      console.error("Failed to save selected withdrawal plan:", error);
      setFeedback({
        type: "error",
        text: "Failed to save the selected withdrawal plan. Please try again.",
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    if (!isFormValid) {
      setFeedback({
        type: "error",
        text: "Please complete all required fields, upload both required documents, and select a withdrawal plan.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setFeedback({
          type: "error",
          text: "Unable to verify your account session.",
        });
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      const existingSnap = await getDoc(userRef);
      const existingData = existingSnap.exists() ? existingSnap.data() : {};
      const existingKyc = existingData?.kyc || {};

      const kycPayload = {
        ...existingKyc,
        status: "under_review",
        submittedAt: serverTimestamp(),
        approvedAt: null,
        rejectedAt: null,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        idType: formData.idType.trim(),
        idNumber: formData.idNumber.trim(),
        ssnLast4: formData.ssnLast4.trim(),
        governmentIdFileName: governmentIdFile?.name || "",
        proofOfAddressFileName: proofOfAddressFile?.name || "",
        withdrawalPlan: selectedPlan,
        withdrawalPlanSelectedAt:
          existingKyc.withdrawalPlanSelectedAt || serverTimestamp(),
      };

      await setDoc(
        userRef,
        {
          kyc: kycPayload,
          kycStatus: "under_review",
          kycCompleted: false,
          transferEnabled: false,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setKycStatus("under_review");
      setFeedback({
        type: "success",
        text: "Your KYC has been submitted successfully and is now under review.",
      });
    } catch (error) {
      console.error("KYC submission failed:", error);
      setFeedback({
        type: "error",
        text: "Something went wrong while submitting your KYC. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatusConfig = useMemo(() => {
    if (kycStatus === "approved") {
      return {
        label: "Verified",
        description:
          "Your identity verification is complete. Withdrawal and transfer permissions can now be enabled.",
        badgeClass: "border border-green-200 bg-green-50 text-green-700",
      };
    }

    if (kycStatus === "rejected") {
      return {
        label: "Rejected",
        description:
          "Your verification was not approved. Please review your details and resubmit.",
        badgeClass: "border border-red-200 bg-red-50 text-red-700",
      };
    }

    if (kycStatus === "under_review") {
      return {
        label: "Under Review",
        description:
          "Your submitted information is currently being reviewed by the compliance team.",
        badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
      };
    }

    return {
      label: "Not Started",
      description:
        "Complete your identity and address verification to unlock higher account privileges.",
      badgeClass: "border border-[#e9e1d5] bg-[#faf8f4] text-[#6e695f]",
    };
  }, [kycStatus]);

  if (loadingPage) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading KYC details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="absolute right-[-30px] top-[-20px] h-32 w-32 rounded-full bg-[#eadfc8]/55 blur-3xl" />
        <div className="absolute bottom-[-30px] left-[-20px] h-28 w-28 rounded-full bg-[#efe8dd]/70 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Identity Verification
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-[2rem]">
              Complete your KYC review
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Verify your identity using a government-issued ID and proof of
              address.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] ${currentStatusConfig.badgeClass}`}
            >
              <ShieldCheck size={15} />
              {currentStatusConfig.label}
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] ${
                selectedPlan
                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                  : "border border-[#e9e1d5] bg-[#faf8f4] text-[#6e695f]"
              }`}
            >
              <WalletCards size={15} />
              {selectedPlan
                ? `Selected Plan ${selectedPlan.label}`
                : "No Plan Selected"}
            </div>
          </div>
        </div>
      </section>

      {feedback.text && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.14)]">
                <UserRound size={19} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Verification Form
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                  Enter your legal information
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter ZIP code"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm tracking-[0.08em] text-[#111111] outline-none transition placeholder:tracking-normal placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  ID Type
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111] focus:bg-white"
                >
                  <option>Driver&apos;s License</option>
                  <option>State ID</option>
                  <option>U.S. Passport</option>
                  <option>Permanent Resident Card</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  ID Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter identification number"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  SSN (Last 4 digits)
                </label>
                <input
                  type="text"
                  name="ssnLast4"
                  value={formData.ssnLast4}
                  onChange={handleChange}
                  placeholder="Enter last 4 digits"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm tracking-[0.18em] text-[#111111] outline-none transition placeholder:tracking-normal placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-dashed border-[#dfd6ca] bg-[#fcfbf8] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                    <FileBadge2 size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-[#111111]">
                    Upload Government ID
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#666666]">
                    Upload a clear photo or PDF of your driver&apos;s license,
                    state ID, passport, or residence card.
                  </p>

                  <label className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e2d9cc] bg-white px-4 text-sm font-medium text-[#111111] transition hover:bg-[#faf7f1]">
                    <Upload size={16} />
                    Choose file
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleGovernmentIdUpload}
                      className="hidden"
                    />
                  </label>

                  {governmentIdFile && (
                    <p className="mt-3 text-xs text-green-700">
                      Selected: {governmentIdFile.name}
                    </p>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-dashed border-[#dfd6ca] bg-[#fcfbf8] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                    <Camera size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-[#111111]">
                    Upload Proof of Address
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#666666]">
                    Upload a utility bill, lease statement, bank statement, or
                    similar address document.
                  </p>

                  <label className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e2d9cc] bg-white px-4 text-sm font-medium text-[#111111] transition hover:bg-[#faf7f1]">
                    <Upload size={16} />
                    Choose file
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleProofOfAddressUpload}
                      className="hidden"
                    />
                  </label>

                  {proofOfAddressFile && (
                    <p className="mt-3 text-xs text-green-700">
                      Selected: {proofOfAddressFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 rounded-[1.75rem] border border-[#e9dfd1] bg-[#fcfbf8] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                      KYC Payment Plan
                    </p>
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#111111]">
                      Select your withdrawal plan
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#666666]">
                      Choose one withdrawal plan. Once selected, it cannot be
                      changed for 48 hours.
                    </p>
                  </div>

                  {selectedPlan && (
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-blue-700">
                      <WalletCards size={14} />
                      {selectedPlan.label}
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {WITHDRAWAL_PLANS.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    const isDisabled =
                      savingPlan || (isPlanLocked && !isSelected);

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isDisabled}
                        className={`rounded-[1.35rem] border p-4 text-left transition ${
                          isSelected
                            ? "border-[#111111] bg-[#111111] text-white shadow-[0_16px_34px_rgba(17,17,17,0.16)]"
                            : "border-[#e4dbce] bg-white text-[#111111] hover:border-[#111111]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-[0.18em] ${
                            isSelected ? "text-white/70" : "text-[#8a847a]"
                          }`}
                        >
                          Withdrawal Plan
                        </p>
                        <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                          {plan.label}
                        </p>
                        <p
                          className={`mt-2 text-sm leading-6 ${
                            isSelected ? "text-white/80" : "text-[#666666]"
                          }`}
                        >
                          Premium withdrawal threshold selection for this KYC account.
                        </p>
                      </button>
                    );
                  })}
                </div>

                {selectedPlan && (
                  <div className="mt-5 rounded-[1.35rem] bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
                        <Lock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">
                          Selected plan: {selectedPlan.label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#666666]">
                          {isPlanLocked
                            ? `This plan is locked and cannot be changed for another ${formatRemainingTime(
                                planLockRemainingMs
                              )}.`
                            : "The 48-hour lock period has ended. You can now choose another plan if needed."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting || kycStatus === "approved"}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BadgeCheck size={18} />
                  {submitting
                    ? "Submitting KYC..."
                    : kycStatus === "approved"
                    ? "KYC Already Approved"
                    : "Submit KYC"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <ShieldCheck size={19} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Verification Status
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                  KYC overview
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-[1.35rem] bg-[#faf7f1] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                Current Status
              </p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">
                {currentStatusConfig.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                {currentStatusConfig.description}
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] bg-[#faf7f1] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                Selected Withdrawal Plan
              </p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">
                {selectedPlan ? selectedPlan.label : "No plan selected"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                {selectedPlan
                  ? isPlanLocked
                    ? `Plan selection is locked for ${formatRemainingTime(
                        planLockRemainingMs
                      )}.`
                    : "Your plan can now be changed because the 48-hour lock has ended."
                  : "Select a withdrawal plan to continue your KYC flow."}
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] bg-[#faf7f1] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                Completion Progress
              </p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#ece4d8]">
                <div
                  className="h-full rounded-full bg-[#111111] transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#111111]">
                {completionPercent}% completed
              </p>
            </div>

            <div className="mt-4 grid gap-4">
              {verificationSteps.map((item) => {
                const styles = getStepStatusStyles(item.status);
                const Icon = styles.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.35rem] bg-[#faf7f1] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${styles.dot}`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-[#666666]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${styles.badge}`}
                      >
                        <Icon size={12} />
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <FileText size={19} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Review Information
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                  Important requirements
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                <p className="text-sm font-semibold text-[#111111]">
                  Legal information only
                </p>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Use your full legal identity exactly as it appears on your
                  official documentation.
                </p>
              </div>

              <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                <p className="text-sm font-semibold text-[#111111]">
                  Documents must be readable
                </p>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Cropped, blurred, expired, or incomplete files may be rejected
                  during review.
                </p>
              </div>

              <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                <p className="text-sm font-semibold text-[#111111]">
                  Plan lock period
                </p>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Once a withdrawal plan is selected, it cannot be changed for
                  48 hours. This selected plan is shown at the top of the page
                  and saved to Firestore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}