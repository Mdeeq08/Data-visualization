import { Outlet } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useRef, useState } from "react";

const Layout = () => {
  // Only control mobile toggle
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar if clicked outside on mobile
  useClickOutside([sidebarRef], () => {
    if (mobileOpen) setMobileOpen(false)
  });

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      {/* Black overlay on mobile when sidebar is open */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          mobileOpen && "pointer-events-auto z-50 opacity-30 md:hidden"
        )}
      />

      {/* 🔒 Always collapsed on desktop, toggle on mobile */}
      <Sidebar
        ref={sidebarRef}
        collapsed={true}
        className={cn(
          mobileOpen ? "max-md:left-0" : "max-md:-left-full"
        )}
      />

      {/* Layout shift to allow sidebar space */}
      <div className="transition-[margin] duration-300 md:ml-[70px]">
        <Header
          collapsed={true}
          setCollapsed={() => setMobileOpen((prev) => !prev)}
        />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
