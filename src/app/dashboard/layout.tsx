import SideNavLayout from "@/components/layout/side-nav-layout";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SideNavLayout>{children}</SideNavLayout>;
};

export default Layout;
