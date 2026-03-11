import AdminUserRow from "@/components/admin/AdminUserRow";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

export default function AdminUsersTable({ users }) {
  if (!users.length) {
    return (
      <AdminEmptyState
        title="No users found"
        description="No matching users were found in your Firestore records. Try changing the search term or create a new customer account first."
      />
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <AdminUserRow key={user.uid} user={user} />
      ))}
    </div>
  );
}