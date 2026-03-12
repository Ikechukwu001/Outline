"use client";

import { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  SendHorizonal,
  BadgeCheck,
  Wallet,
  FileText,
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

  const { userName, userRecord, loadingData } = useDashboardData();

  const handleAccountNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);
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
      const reference = generateReference();
      const transactionDate = new Date().toLocaleString();

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
                Complete a direct bank transfer with a refined banking form built
                to feel professional, trusted, and account-aware.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6e695f]">
              <ShieldCheck size={15} />
              Protected transfer validation
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
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
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
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm tracking-[0.12em] text-[#111111] outline-none transition placeholder:tracking-normal placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-[#232323]">
                    Recipient Account Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient full name"
                    className="h-14 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
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
                    placeholder="Add a payment note"
                    className="h-16 w-full rounded-2xl border border-[#e8e1d5] bg-[#fcfbf8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa294] focus:border-[#111111] focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <SendHorizonal size={18} />
                    {submitting ? "Processing transfer..." : "Transfer Funds"}
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
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                  <BadgeCheck size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Balance-aware transfer logic
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">
                    This transfer flow checks your available balance before
                    processing. If funds are insufficient, the transfer is blocked
                    and a proper banking-style warning is shown.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                  <Landmark size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Professional transfer record
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">
                    Successful transfers are recorded in your transaction history
                    and immediately reflected in your dashboard balance.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e9dfd1] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]">
                  <FileText size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    Premium receipt included
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">
                    Every successful transfer can now display a polished receipt
                    popup containing the key transfer details for a more realistic
                    banking experience.
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