"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

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

export default function useDashboardData() {
  const [userName, setUserName] = useState("Customer");
  const [userEmail, setUserEmail] = useState("");
  const [userRecord, setUserRecord] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null;
    let unsubscribeNotifications = null;
    let unsubscribeTransactions = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserName("Customer");
        setUserEmail("");
        setUserRecord(null);
        setNotifications([]);
        setTransactions([]);
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setUserName(user.displayName || user.email?.split("@")[0] || "Customer");
      setUserEmail(user.email || "");

      const userRef = doc(db, "users", user.uid);

      unsubscribeUserDoc = onSnapshot(
        userRef,
        (userSnap) => {
          if (userSnap.exists()) {
            const loadedUser = {
              uid: userSnap.id,
              ...userSnap.data(),
            };

            setUserRecord(loadedUser);

            if (loadedUser.fullName) {
              setUserName(loadedUser.fullName);
            }
          } else {
            setUserRecord(null);
          }
        },
        (error) => {
          console.error("Failed to listen to user record:", error);
        }
      );

      const notificationsRef = collection(db, "notifications");
      const notificationsQuery = query(
        notificationsRef,
        where("userId", "==", user.uid)
      );

      unsubscribeNotifications = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const userNotifications = snapshot.docs
            .map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
            }))
            .sort((a, b) => {
              const aTime = a.createdAt?.seconds || 0;
              const bTime = b.createdAt?.seconds || 0;
              return bTime - aTime;
            })
            .map((item) => ({
              ...item,
              createdAtLabel: formatCreatedAt(item.createdAt),
            }));

          setNotifications(userNotifications);
        },
        (error) => {
          console.error("Failed to listen to notifications:", error);
        }
      );

      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", user.uid)
      );

      unsubscribeTransactions = onSnapshot(
        transactionsQuery,
        (snapshot) => {
          const userTransactions = snapshot.docs
            .map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
            }))
            .sort((a, b) => {
              const aTime = a.createdAt?.seconds || 0;
              const bTime = b.createdAt?.seconds || 0;
              return bTime - aTime;
            })
            .map((item) => ({
              ...item,
              createdAtLabel: formatCreatedAt(item.createdAt),
            }));

          setTransactions(userTransactions);
          setLoadingData(false);
        },
        (error) => {
          console.error("Failed to listen to transactions:", error);
          setLoadingData(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.Tawk_API) return;

    const applyVisitorData = () => {
      try {
        if (window.Tawk_API.setAttributes) {
          window.Tawk_API.setAttributes(
            {
              name: userName || "Customer",
              email: userEmail || "",
              accountNumber: userRecord?.accountNumber || "",
              status: userRecord?.status || "active",
            },
            function (error) {
              if (error) {
                console.error("Tawk.to setAttributes error:", error);
              }
            }
          );
        }
      } catch (error) {
        console.error("Failed to send visitor data to Tawk.to:", error);
      }
    };

    if (window.Tawk_API.onLoad) {
      const previousOnLoad = window.Tawk_API.onLoad;

      window.Tawk_API.onLoad = function () {
        if (typeof previousOnLoad === "function") {
          previousOnLoad();
        }
        applyVisitorData();
      };
    } else {
      const waitForTawk = setInterval(() => {
        if (window.Tawk_API && typeof window.Tawk_API.setAttributes === "function") {
          applyVisitorData();
          clearInterval(waitForTawk);
        }
      }, 500);

      return () => clearInterval(waitForTawk);
    }
  }, [userName, userEmail, userRecord]);

  return {
    userName,
    userEmail,
    userRecord,
    notifications,
    transactions,
    loadingData,
  };
}