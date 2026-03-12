"use client";

import { X, BadgeCheck, ReceiptText, Landmark, UserRound } from "lucide-react";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function TransferReceiptModal({ open, receiptData, onClose }) {
  if (!open || !receiptData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#e7ddd0] bg-[#fffdfa] shadow-[0_30px_80px_rgba(17,17,17,0.20)]">
        <div className="absolute right-[-30px] top-[-20px] h-36 w-36 rounded-full bg-[#eadfc8]/60 blur-3xl" />
        <div className="absolute bottom-[-40px] left-[-20px] h-32 w-32 rounded-full bg-[#efe8dd]/70 blur-3xl" />

        <div className="relative border-b border-[#eee4d7] px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#948d83]">
                Transfer Receipt
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">
                REFUND ACCOUNT
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e8dfd1] bg-white text-[#111111] transition hover:bg-[#faf7f1]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative px-6 py-6 sm:px-7">
          <div className="mb-6 rounded-[1.5rem] bg-[#111111] px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Transaction Status
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <BadgeCheck size={18} className="text-green-400" />
                  <span className="text-sm font-semibold">
                    {receiptData.status}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Amount
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  {formatMoney(receiptData.amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[1.5rem] border border-[#ece3d7] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8e877c]">
                    Sender Details
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#111111]">
                    Account Owner
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#666666]">Sender Name</span>
                  <span className="text-right font-medium text-[#111111]">
                    {receiptData.senderName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#666666]">Sender Account</span>
                  <span className="text-right font-medium text-[#111111]">
                    {receiptData.senderAccountNumber || "Not assigned"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#ece3d7] bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <Landmark size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8e877c]">
                    Recipient Details
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#111111]">
                    Beneficiary Information
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#666666]">Recipient Name</span>
                  <span className="text-right font-medium text-[#111111]">
                    {receiptData.recipientName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#666666]">Bank Name</span>
                  <span className="text-right font-medium text-[#111111]">
                    {receiptData.bankName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#666666]">Account Number</span>
                  <span className="text-right font-medium text-[#111111]">
                    {receiptData.recipientAccountNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[#ece3d7] bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <ReceiptText size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8e877c]">
                  Receipt Details
                </p>
                <p className="mt-1 text-sm font-semibold text-[#111111]">
                  Transaction Information
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#666666]">Reference</span>
                <span className="text-right font-medium text-[#111111]">
                  {receiptData.reference}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#666666]">Date</span>
                <span className="text-right font-medium text-[#111111]">
                  {receiptData.date}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 sm:col-span-2">
                <span className="text-[#666666]">Description</span>
                <span className="text-right font-medium text-[#111111]">
                  {receiptData.description || "Bank transfer"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(17,17,17,0.16)] transition hover:opacity-95"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}