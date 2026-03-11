import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

export default function DashboardShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <DashboardSidebar />

        <div className="min-w-0 flex-1 pb-28 xl:pb-6">
          {children}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}