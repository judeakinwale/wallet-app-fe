"use client";
import React, { useEffect, useState } from "react";
import { SideNav } from "./side-nav";
import { Header } from "./header";
import { useAuth } from "@/context/auth-context";

const SideNavLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userInfo = {
    imageUrl: "https://picsum.photos/100",
    ...(mounted ? user : {}),
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav
        onLogout={logout}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={userInfo}
          onMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default SideNavLayout;
