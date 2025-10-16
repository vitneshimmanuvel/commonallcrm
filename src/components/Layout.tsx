import { SidebarProvider } from "@/components/ui/sidebar";
import { CrmSidebar } from "@/components/CrmSidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard">
        <CrmSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}