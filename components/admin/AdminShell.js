import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AdminSidebar />

        <div className="min-w-0 flex-1 pb-28 xl:pb-6">
          {children}
        </div>
      </div>

      <AdminMobileNav />
    </div>
  );
}