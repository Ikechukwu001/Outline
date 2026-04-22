"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  SendHorizonal,
  BadgeCheck,
  Wallet,
  ShieldAlert,
  WalletCards,
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
import TransferReceiptModal from "@/components/dashboard/TransferReceiptModal";

function generateReference() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString().slice(-6);
  return `RA-${randomPart}${timePart}`;
}

const KNOWN_RECIPIENTS = [
  {
    bankName: "Chase Bank USA",
    accountNumber: "4068217359",
    accountName: "Olivia Bennett",
  },
  {
    bankName: "Barclays UK",
    accountNumber: "5179042863",
    accountName: "Ethan Carter",
  },
];

function normalizeText(value) {
  return value.trim().toLowerCase();
}

export default function TransferPage() {
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

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const [suspensionModalOpen, setSuspensionModalOpen] = useState(false);
  const [kycRequiredModalOpen, setKycRequiredModalOpen] = useState(false);

  const { userName, userRecord, loadingData } = useDashboardData();

  const matchedRecipient = useMemo(() => {
    const normalizedBank = normalizeText(bankName);
    const normalizedAccount = accountNumber.trim();

    return (
      KNOWN_RECIPIENTS.find(
        (item) =>
          normalizeText(item.bankName) === normalizedBank &&
          item.accountNumber === normalizedAccount
      ) || null
    );
  }, [bankName, accountNumber]);

  const isKycApproved = userRecord?.kycStatus === "approved";
  const selectedWithdrawalPlan = userRecord?.kyc?.withdrawalPlan || null;

  useEffect(() => {
    if (matchedRecipient) {
      setRecipientName(matchedRecipient.accountName);
    }
  }, [matchedRecipient]);

  const handleAccountNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);
  };

  const handleRecipientNameChange = (value) => {
    if (matchedRecipient) return;
    setRecipientName(value);
  };

  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setRecipientName("");
    setAmount("");
    setDescription("");
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
      const trimmedRecipientName = recipientName.trim();
      const trimmedDescription = description.trim();
      const numericAmount = Number(amount);

      if (!trimmedBankName) {
        setFeedback({
          type: "error",
          text: "Please enter the recipient bank name.",
        });
        return;
      }

      if (!trimmedRecipientName) {
        setFeedback({
          type: "error",
          text: "Please enter the recipient account name.",
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

      if (!isKycApproved) {
        setKycRequiredModalOpen(true);
        return;
      }

      if (userRecord?.transferSuspended) {
        setSuspensionModalOpen(true);
        return;
      }

      const reference = generateReference();
      const transactionDate = new Date().toLocaleString();

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

        if (userData?.kycStatus !== "approved") {
          throw new Error("KYC_NOT_APPROVED");
        }

        if (userData?.transferSuspended) {
          throw new Error("TRANSFER_SUSPENDED");
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
        reference,
        status: "completed",
        createdAt: serverTimestamp(),
      });

      setReceiptData({
        senderName: userName || "Customer",
        senderAccountNumber: userRecord?.accountNumber || "",
        recipientName: trimmedRecipientName,
        bankName: trimmedBankName,
        recipientAccountNumber: trimmedAccountNumber,
        amount: numericAmount,
        description: trimmedDescription || "Bank transfer",
        reference,
        status: "Successful",
        date: transactionDate,
      });

      setReceiptOpen(true);

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
      } else if (error.message === "KYC_NOT_APPROVED") {
        setKycRequiredModalOpen(true);
        setFeedback({
          type: "error",
          text: "Your KYC must be approved before you can transfer funds.",
        });
      } else if (error.message === "TRANSFER_SUSPENDED") {
        setSuspensionModalOpen(true);
        setFeedback({
          type: "error",
          text: "Transfers are currently suspended on this account.",
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
    <>
      <TransferReceiptModal
        open={receiptOpen}
        receiptData={receiptData}
        onClose={() => setReceiptOpen(false)}
      />

      {kycRequiredModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-[#e7ddd0] bg-[#fffdfa] p-6 shadow-[0_30px_80px_rgba(17,17,17,0.20)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-amber-50 text-amber-600">
              <ShieldAlert size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#111111]">
              KYC Approval Required
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#666666]">
              Your identity verification must be approved before transfers can
              be enabled on this account. Please complete your KYC and wait for
              admin approval.
            </p>

            <button
              type="button"
              onClick={() => setKycRequiredModalOpen(false)}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)] transition hover:opacity-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {suspensionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-[#e7ddd0] bg-[#fffdfa] p-6 shadow-[0_30px_80px_rgba(17,17,17,0.20)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-red-50 text-red-600">
              <BadgeCheck size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#111111]">
              Transfer Suspended
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#666666]">
              Transfers are currently suspended on this account. Contact customer
              care for support and further assistance.
            </p>

            <button
              type="button"
              onClick={() => setSuspensionModalOpen(false)}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)] transition hover:opacity-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-white/92 p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-7">
          <div className="absolute right-[-30px] top-[-20px] h-32 w-32 rounded-full bg-[#eadfc8]/55 blur-3xl" />
          <div className="absolute bottom-[-30px] left-[-20px] h-28 w-28 rounded-full bg-[#efe8dd]/70 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
                Transfer
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-[2rem]">
                Transfer funds securely
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666666]">
                Complete a direct bank transfer to any recipient worldwide with our secure transfer service.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
                <ShieldCheck size={15} />
                Protected transfer validation
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] ${
                  isKycApproved
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isKycApproved ? <BadgeCheck size={15} /> : <ShieldAlert size={15} />}
                {isKycApproved ? "KYC Approved" : "KYC Required"}
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] ${
                  selectedWithdrawalPlan
                    ? "border border-blue-200 bg-blue-50 text-blue-700"
                    : "border border-[#e9e1d5] bg-[#faf8f4] text-[#6e695f]"
                }`}
              >
                <WalletCards size={15} />
                {selectedWithdrawalPlan
                  ? `Plan ${selectedWithdrawalPlan.label}`
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
                  <SendHorizonal size={19} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                    Direct Transfer Form
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                    Enter recipient details
                  </h2>
                </div>
              </div>

              {!isKycApproved && (
                <div className="mb-5 rounded-[1.35rem] border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Transfer locked until KYC approval
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-700">
                    Your account must complete and receive approval for KYC
                    verification before transfers can be processed.
                  </p>
                </div>
              )}

              <form onSubmit={handleTransfer} className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Recipient Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter recipient bank name"
                    disabled={!isKycApproved || submitting}
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Recipient Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="Enter 10-digit account number"
                    disabled={!isKycApproved || submitting}
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm tracking-[0.12em] text-[#111111] outline-none transition placeholder:tracking-normal placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Recipient Account Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => handleRecipientNameChange(e.target.value)}
                    placeholder="Enter recipient full name"
                    disabled={!isKycApproved || !!matchedRecipient || submitting}
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  {matchedRecipient && (
                    <p className="mt-2 text-xs text-[#6a6a6a]">
                      Account name was matched automatically from saved bank
                      details.
                    </p>
                  )}
                </div>

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
                    disabled={!isKycApproved || submitting}
                    className="h-16 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-lg font-semibold tracking-[-0.02em] text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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
                    placeholder="Add a payment note"
                    disabled={!isKycApproved || submitting}
                    className="h-16 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2 pt-1">
                  <button
                    type="submit"
                    disabled={!isKycApproved || submitting}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizonal size={18} />
                    {submitting
                      ? "Processing transfer..."
                      : !isKycApproved
                      ? "KYC Approval Required"
                      : "Transfer Funds"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <Wallet size={19} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
                    Account Summary
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                    Transfer overview
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                    Account Holder
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">
                    {userName || "Customer"}
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                    Available Balance
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">
                    ${Number(userRecord?.balance || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-[#faf7f1] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847a]">
                    Account Number
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">
                    {userRecord?.accountNumber || "Not assigned"}
                  </p>
                </div>

                <div
                  className={`rounded-[1.35rem] p-4 ${
                    isKycApproved ? "bg-green-50" : "bg-amber-50"
                  }`}
                >
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      isKycApproved ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    KYC Status
                  </p>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      isKycApproved ? "text-green-800" : "text-amber-800"
                    }`}
                  >
                    {isKycApproved ? "Approved" : "Pending approval"}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      isKycApproved ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {isKycApproved
                      ? "Your account is approved for transfer access."
                      : "Transfers remain locked until your KYC has been approved by admin."}
                  </p>
                </div>

                <div
                  className={`rounded-[1.35rem] p-4 ${
                    selectedWithdrawalPlan ? "bg-blue-50" : "bg-[#faf7f1]"
                  }`}
                >
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      selectedWithdrawalPlan ? "text-blue-700" : "text-[#8a847a]"
                    }`}
                  >
                    Selected Withdrawal Plan
                  </p>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      selectedWithdrawalPlan ? "text-blue-900" : "text-[#111111]"
                    }`}
                  >
                    {selectedWithdrawalPlan?.label || "No plan selected"}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      selectedWithdrawalPlan ? "text-blue-800" : "text-[#666666]"
                    }`}
                  >
                    {selectedWithdrawalPlan
                      ? "This is the withdrawal plan selected during your KYC submission."
                      : "You have not selected a withdrawal plan in your KYC yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}