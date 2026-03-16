"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import AdminShell from "@/components/admin/AdminShell";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminUserProfileCard from "@/components/admin/AdminUserProfileCard";
import AdminBalanceEditor from "@/components/admin/AdminBalanceEditor";
import AdminAccountNumberEditor from "@/components/admin/AdminAccountNumberEditor";
import AdminNotificationForm from "@/components/admin/AdminNotificationForm";
import AdminUserNotificationsList from "@/components/admin/AdminUserNotificationsList";
import AdminStatusEditor from "@/components/admin/AdminStatusEditor";
import AdminTransferSuspensionEditor from "@/components/admin/AdminTransferSuspensionEditor";

function formatCreatedAt(value) {
  if (!value) return "Recently added";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString();
    }

    return "Recently added";
  } catch {
    return "Recently added";
  }
}

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const uid = params?.uid;

  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [fundAmount, setFundAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingBalance, setSavingBalance] = useState(false);
  const [savingAccountNumber, setSavingAccountNumber] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTransferSuspension, setSavingTransferSuspension] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    async function loadUserData() {
      if (!uid) return;

      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setFeedback({
            type: "error",
            text: "User record was not found.",
          });
          setLoadingPage(false);
          return;
        }

        const loadedUser = {
          uid: userSnap.id,
          transferSuspended: false,
          ...userSnap.data(),
        };

        setUserData(loadedUser);
        setAccountNumber(loadedUser.accountNumber || "");

        const notificationsRef = collection(db, "notifications");
        const notificationsQuery = query(
          notificationsRef,
          orderBy("createdAt", "desc")
        );
        const notificationsSnap = await getDocs(notificationsQuery);

        const filteredNotifications = notificationsSnap.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .filter((item) => item.userId === uid)
          .map((item) => ({
            ...item,
            createdAtLabel: formatCreatedAt(item.createdAt),
          }));

        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Failed to load user details:", error);
        setFeedback({
          type: "error",
          text: "Failed to load user details.",
        });
      } finally {
        setLoadingPage(false);
      }
    }

    loadUserData();
  }, [uid]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace("/admin/login");
    } catch (error) {
      console.error("Admin logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleBalanceUpdate = async (e) => {
    e.preventDefault();
    setSavingBalance(true);
    setFeedback({ type: "", text: "" });

    try {
      const numericAmount = Number(fundAmount);

      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        setFeedback({
          type: "error",
          text: "Please enter a valid amount to add.",
        });
        return;
      }

      const userRef = doc(db, "users", uid);
      const transactionRef = doc(collection(db, "transactions"));
      const notificationRef = doc(collection(db, "notifications"));

      let updatedBalance = 0;
      let fundedUserName = userData?.fullName || "Customer";

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("USER_NOT_FOUND");
        }

        const currentUserData = userSnap.data();
        const currentBalance = Number(currentUserData.balance || 0);

        fundedUserName = currentUserData.fullName || fundedUserName;
        updatedBalance = currentBalance + numericAmount;

        transaction.update(userRef, {
          balance: updatedBalance,
        });

        transaction.set(transactionRef, {
          userId: uid,
          type: "credit",
          title: "Account Funding",
          amount: numericAmount,
          description: "Admin top up",
          status: "completed",
          createdAt: serverTimestamp(),
        });

        transaction.set(notificationRef, {
          userId: uid,
          title: "Account Credited",
          message: `Your account has been credited with $${numericAmount.toLocaleString()}.`,
          read: false,
          createdAt: serverTimestamp(),
        });
      });

      setUserData((prev) => ({
        ...prev,
        balance: updatedBalance,
      }));

      setNotifications((prev) => [
        {
          id: notificationRef.id,
          userId: uid,
          title: "Account Credited",
          message: `Your account has been credited with $${numericAmount.toLocaleString()}.`,
          read: false,
          createdAtLabel: "Recently added",
        },
        ...prev,
      ]);

      setFundAmount("");

      setFeedback({
        type: "success",
        text: `${fundedUserName}'s balance was funded successfully.`,
      });
    } catch (error) {
      console.error("Balance funding failed:", error);
      setFeedback({
        type: "error",
        text: "Failed to add funds to this account.",
      });
    } finally {
      setSavingBalance(false);
    }
  };

  const handleAccountNumberSave = async (e) => {
    e.preventDefault();
    setSavingAccountNumber(true);
    setFeedback({ type: "", text: "" });

    try {
      const trimmed = accountNumber.trim();

      if (!/^\d{10}$/.test(trimmed)) {
        setFeedback({
          type: "error",
          text: "Account number must be exactly 10 digits.",
        });
        return;
      }

      await updateDoc(doc(db, "users", uid), {
        accountNumber: trimmed,
      });

      setUserData((prev) => ({
        ...prev,
        accountNumber: trimmed,
      }));

      setFeedback({
        type: "success",
        text: "Account number saved successfully.",
      });
    } catch (error) {
      console.error("Account number save failed:", error);
      setFeedback({
        type: "error",
        text: "Failed to save account number.",
      });
    } finally {
      setSavingAccountNumber(false);
    }
  };

  const handleGenerateAccountNumber = () => {
    setAccountNumber(generateAccountNumber());
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setSendingNotification(true);
    setFeedback({ type: "", text: "" });

    try {
      const trimmedTitle = notificationTitle.trim();
      const trimmedMessage = notificationMessage.trim();

      if (!trimmedTitle || !trimmedMessage) {
        setFeedback({
          type: "error",
          text: "Notification title and message are required.",
        });
        return;
      }

      const notificationPayload = {
        userId: uid,
        title: trimmedTitle,
        message: trimmedMessage,
        read: false,
        createdAt: serverTimestamp(),
      };

      const newNotificationRef = await addDoc(
        collection(db, "notifications"),
        notificationPayload
      );

      setNotifications((prev) => [
        {
          id: newNotificationRef.id,
          ...notificationPayload,
          createdAtLabel: "Recently added",
        },
        ...prev,
      ]);

      setNotificationTitle("");
      setNotificationMessage("");

      setFeedback({
        type: "success",
        text: "Notification created successfully.",
      });
    } catch (error) {
      console.error("Notification create failed:", error);
      setFeedback({
        type: "error",
        text: "Failed to create notification.",
      });
    } finally {
      setSendingNotification(false);
    }
  };

  const handleSetStatus = async (nextStatus) => {
    setSavingStatus(true);
    setFeedback({ type: "", text: "" });

    try {
      await updateDoc(doc(db, "users", uid), {
        status: nextStatus,
      });

      setUserData((prev) => ({
        ...prev,
        status: nextStatus,
      }));

      setFeedback({
        type: "success",
        text:
          nextStatus === "active"
            ? "Card/account status set to active."
            : "Card/account status set to deactivated.",
      });
    } catch (error) {
      console.error("Status update failed:", error);
      setFeedback({
        type: "error",
        text: "Failed to update card/account status.",
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleToggleTransferSuspension = async (nextValue) => {
    setSavingTransferSuspension(true);
    setFeedback({ type: "", text: "" });

    try {
      await updateDoc(doc(db, "users", uid), {
        transferSuspended: nextValue,
      });

      setUserData((prev) => ({
        ...prev,
        transferSuspended: nextValue,
      }));

      setFeedback({
        type: "success",
        text: nextValue
          ? "Transfers have been suspended for this user."
          : "Transfers have been restored for this user.",
      });
    } catch (error) {
      console.error("Transfer suspension update failed:", error);
      setFeedback({
        type: "error",
        text: "Failed to update transfer suspension state.",
      });
    } finally {
      setSavingTransferSuspension(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <AdminTopbar
          title="User account control"
          subtitle="Manually manage this user’s balance, account number, status, transfer access, and notifications from your admin workspace."
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

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

        {loadingPage ? (
          <div className="rounded-[2rem] border border-[#e8dfd1] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            Loading user details...
          </div>
        ) : !userData ? (
          <div className="rounded-[2rem] border border-[#e8dfd1] bg-white p-8 text-sm text-[#666666] shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            User not found.
          </div>
        ) : (
          <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <AdminUserProfileCard userData={userData} />

              <AdminBalanceEditor
                amountValue={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                onSubmit={handleBalanceUpdate}
                loading={savingBalance}
                currentBalance={userData?.balance || 0}
              />

              <AdminAccountNumberEditor
                accountNumber={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                onSubmit={handleAccountNumberSave}
                onGenerate={handleGenerateAccountNumber}
                loading={savingAccountNumber}
              />

              <AdminStatusEditor
                currentStatus={userData?.status || "active"}
                onSetStatus={handleSetStatus}
                loading={savingStatus}
              />

              <AdminTransferSuspensionEditor
                transferSuspended={!!userData?.transferSuspended}
                onToggle={handleToggleTransferSuspension}
                loading={savingTransferSuspension}
              />
            </div>

            <div className="space-y-5">
              <AdminNotificationForm
                title={notificationTitle}
                message={notificationMessage}
                onTitleChange={(e) => setNotificationTitle(e.target.value)}
                onMessageChange={(e) => setNotificationMessage(e.target.value)}
                onSubmit={handleNotificationSubmit}
                loading={sendingNotification}
              />

              <AdminUserNotificationsList notifications={notifications} />
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  );
}