"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { label: "Profile", href: "/user", icon: User },
  // { label: "Wallets", href: "/wallets", icon: Wallet },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  // { label: "Settings", href: "/settings", icon: Settings },
];

type SideNavProps = {
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

const SideNav: React.FC<SideNavProps> = ({
  onLogout,
  isMobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();

  const navContent = (
    <aside className="flex h-full w-56 xl:w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Wallet App
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {onLogout && (
        <div className="border-t border-border p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{navContent}</div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative z-50">{navContent}</div>
        </div>
      )}
    </>
  );
};

export { SideNav };
