"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  ChevronDown,
  Landmark,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import useDashboardData from "@/components/dashboard/useDashboardData";

const banks = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "UBA",
  "Zenith Bank",
  "Moniepoint",
  "Opay",
  "Kuda",
];

const beneficiaries = [
  {
    name: "Sarah Johnson",
    bank: "Zenith Bank",
    account: "2094567812",
    initials: "SJ",
  },
  {
    name: "Michael Lee",
    bank: "GTBank",
    account: "4821459031",
    initials: "ML",
  },
  {
    name: "Amanda Cole",
    bank: "Access Bank",
    account: "1187345620",
    initials: "AC",
  },
];

export default function TransferPage() {
  const [transferType, setTransferType] = useState("bank");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  const { userName, userRecord, loadingData } = useDashboardData();

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setBankName(beneficiary.bank);
    setAccountNumber(beneficiary.account);
    setRecipientName(beneficiary.name);
    setTransferType("beneficiary");
    setFeedback({ type: "", text: "" });
  };

  const handleAccountNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);

    if (cleaned.length === 10 && !recipientName && transferType === "bank") {
      setRecipientName("Recipient Name");
    } else if (cleaned.length < 10 && transferType === "bank") {
      setRecipientName("");
    }
  };

  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setRecipientName("");
    setAmount("");
    setDescription("");
    setSelectedBeneficiary(null);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", text: "" });

    try {
      const currentUser = auth.currentUser;

      if (!currentUser || !userRecord) {
        setFeedback({
          type: "error",
          text: "Unable to verify your account session.",
        });
        return;
      }

      const trimmedBankName = bankName.trim();
      const trimmedAccountNumber = accountNumber.trim();
      const trimmedRecipientName =
        recipientName.trim() || "Bank Recipient";
      const trimmedDescription = description.trim();
      const numericAmount = Number(amount);

      if (!trimmedBankName) {
        setFeedback({
          type: "error",
          text: "Please select or enter a recipient bank.",
        });
        return;
      }

      if (!/^\d{10}$/.test(trimmedAccountNumber)) {
        setFeedback({
          type: "error",
          text: "Account number must be exactly 10 digits.",
        });
        return;
      }

      if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        setFeedback({
          type: "error",
          text: "Please enter a valid transfer amount.",
        });
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("USER_NOT_FOUND");
        }

        const userData = userSnap.data();
        const currentBalance = Number(userData.balance || 0);

        if (currentBalance < numericAmount) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        const updatedBalance = currentBalance - numericAmount;

        transaction.update(userRef, {
          balance: updatedBalance,
        });
      });

      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type: "transfer",
        bankName: trimmedBankName,
        recipientName: trimmedRecipientName,
        recipientAccountNumber: trimmedAccountNumber,
        amount: numericAmount,
        description: trimmedDescription || "Bank transfer",
        status: "completed",
        createdAt: serverTimestamp(),
      });

      setFeedback({
        type: "success",
        text: `Transfer of $${numericAmount.toLocaleString()} completed successfully.`,
      });

      resetForm();
    } catch (error) {
      console.error("Transfer failed:", error);

      if (error.message === "INSUFFICIENT_BALANCE") {
        setFeedback({
          type: "error",
          text: "Insufficient balance. Please fund your account and try again.",
        });
      } else if (error.message === "USER_NOT_FOUND") {
        setFeedback({
          type: "error",
          text: "Your account record could not be found.",
        });
      } else {
        setFeedback({
          type: "error",
          text: "Transfer failed. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
        Loading transfer data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#ece4d8] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
              Transfer
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[2rem]">
              Send money professionally
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
              Transfer funds with a premium banking flow that validates your
              balance, records the transfer, and updates your account instantly.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
            <ShieldCheck size={15} />
            Protected transfer flow
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

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)] sm:p-6">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setTransferType("bank")}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  transferType === "bank"
                    ? "bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]"
                    : "bg-[#f5f1ea] text-[#5f5a53]"
                }`}
              >
                Bank Transfer
              </button>

              <button
                type="button"
                onClick={() => setTransferType("beneficiary")}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  transferType === "beneficiary"
                    ? "bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]"
                    : "bg-[#f5f1ea] text-[#5f5a53]"
                }`}
              >
                Saved Beneficiary
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-5">
              {transferType === "bank" ? (
                <>
                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                      Recipient Bank
                    </label>
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="h-14 w-full appearance-none rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 pr-10 text-sm text-[#111111] outline-none transition focus:border-[#111111] focus:bg-white"
                      >
                        <option value="">Select recipient bank</option>
                        {banks.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#777777]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) =>
                        handleAccountNumberChange(e.target.value)
                      }
                      placeholder="Enter 10-digit account number"
                      className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient name"
                      className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Choose Beneficiary
                  </label>

                  <div className="space-y-3">
                    {beneficiaries.map((beneficiary) => {
                      const isActive =
                        selectedBeneficiary?.account === beneficiary.account;

                      return (
                        <button
                          key={beneficiary.account}
                          type="button"
                          onClick={() => handleBeneficiarySelect(beneficiary)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-[#111111] bg-[#111111] text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)]"
                              : "border-[#ece4d8] bg-[#fcfbf8] text-[#111111] hover:bg-[#f8f5ef]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold ${
                                isActive
                                  ? "bg-white/10 text-white"
                                  : "bg-[#f1ece4] text-[#111111]"
                              }`}
                            >
                              {beneficiary.initials}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {beneficiary.name}
                              </p>
                              <p
                                className={`mt-1 text-xs ${
                                  isActive ? "text-white/70" : "text-[#777777]"
                                }`}
                              >
                                {beneficiary.bank} • ****
                                {beneficiary.account.slice(-4)}
                              </p>
                            </div>
                          </div>

                          <ArrowRightLeft size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-16 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-lg font-semibold tracking-[-0.02em] text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a short note"
                  className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="h-14 w-full rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Processing transfer..." : "Transfer Funds"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                  Recent Recipients
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
                  Send again
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f2eb] text-[#111111]">
                <Search size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {beneficiaries.map((person) => (
                <div
                  key={person.account}
                  className="flex items-center justify-between rounded-2xl bg-[#faf8f4] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold text-white">
                      {person.initials}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        {person.name}
                      </p>
                      <p className="mt-1 text-xs text-[#7a7a7a]">
                        {person.bank} • ****{person.account.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBeneficiarySelect(person)}
                    className="rounded-full border border-[#dfd8cc] px-4 py-2 text-xs font-medium text-[#111111] transition hover:bg-white"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Transfer Summary
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
              Review details
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d6d6d]">Account holder</span>
                <span className="font-semibold text-[#111111]">
                  {userName || "Customer"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d6d6d]">Available balance</span>
                <span className="font-semibold text-[#111111]">
                  ${Number(userRecord?.balance || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d6d6d]">Account number</span>
                <span className="font-semibold text-[#111111]">
                  {userRecord?.accountNumber || "Not assigned"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6d6d6d]">Transfer fee</span>
                <span className="font-semibold text-[#111111]">$0.00</span>
              </div>

              <div className="h-px bg-[#eee7dc]" />

              <div className="rounded-2xl bg-[#f6f2eb] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                    <Landmark size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      Professional transfer validation
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#666666]">
                      Transfers are validated against your available balance
                      before completion, just like a proper banking flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece4d8] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Beneficiary Access
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f2eb] text-[#111111]">
                <UserRound size={19} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Manual and saved recipient support
                </p>
                <p className="mt-1 text-sm text-[#666666]">
                  Transfer by entering new bank details or quickly selecting a
                  saved beneficiary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}