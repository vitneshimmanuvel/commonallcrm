import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Settings, 
  BarChart3,
  Briefcase,
  Calendar,
  DollarSign
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Overview & metrics"
  },
  {
    title: "Leads",
    url: "/leads",
    icon: UserPlus,
    description: "Lead management"
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    description: "Active clients"
  },
  {
    title: "Services",
    url: "/services",
    icon: Briefcase,
    description: "Service offerings"
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
    description: "Invoice management"
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Appointments"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "Reports & insights"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "System settings"
  }
];

export function CrmSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md font-medium" 
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth";
  };

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">Settlo CRM Pro</h2>
              <p className="text-xs text-sidebar-foreground/60">Business Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-3 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClasses(item.url)} flex items-center gap-3 px-3 py-2.5 rounded-lg group`}
                      end={item.url === "/"}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs opacity-70 truncate">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}