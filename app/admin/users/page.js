"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Wallet, Hash } from "lucide-react";

import { auth, db } from "@/lib/firebase";
import AdminShell from "@/components/admin/AdminShell";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(usersQuery);

        const usersData = snapshot.docs.map((docItem) => ({
          uid: docItem.id,
          ...docItem.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load users:", error);

        try {
          const fallbackSnapshot = await getDocs(collection(db, "users"));
          const fallbackUsers = fallbackSnapshot.docs.map((docItem) => ({
            uid: docItem.id,
            ...docItem.data(),
          }));

          setUsers(fallbackUsers);
        } catch (fallbackError) {
          console.error("Fallback users fetch failed:", fallbackError);
        }
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

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

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const fullName = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      return fullName.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      title: "Visible Results",
      value: filteredUsers.length,
      icon: UserCheck,
    },
    {
      title: "Users With Balance",
      value: users.filter((user) => Number(user.balance || 0) > 0).length,
      icon: Wallet,
    },
    {
      title: "Assigned Accounts",
      value: users.filter((user) => user.accountNumber).length,
      icon: Hash,
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <AdminTopbar
          title="Users management"
          subtitle="View all registered customers, search user records, and open individual accounts for manual balance, account number, and notification control."
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {stats.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-[#e8dfd1] bg-white p-5 shadow-[0_14px_34px_rgba(17,17,17,0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_10px_24px_rgba(17,17,17,0.14)]">
                  <Icon size={19} />
                </div>

                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#8e877c]">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#111111]">
                  {card.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-[#e8dfd1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-6">
          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#948d83]">
              Search Users
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#111111]">
              Customer records
            </h2>
          </div>

          <AdminSearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="mt-6">
            {loadingUsers ? (
              <div className="rounded-[1.75rem] border border-[#ece3d7] bg-[#fcfbf8] p-8 text-sm text-[#666666]">
                Loading user records...
              </div>
            ) : (
              <AdminUsersTable users={filteredUsers} />
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}