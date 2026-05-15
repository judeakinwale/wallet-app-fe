"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderUser = {
  name: string;
  imageUrl?: string;
};

type HeaderProps = {
  user: HeaderUser;
  className?: string;
  onMenuToggle?: () => void;
};

function UserAvatar({ name, imageUrl }: HeaderUser) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {initials}
    </span>
  );
}

const Header: React.FC<HeaderProps> = ({ user, className, onMenuToggle }) => {
  return (
    <header
      className={cn(
        "flex h-14 w-full items-center justify-between border-b border-border bg-background px-4 md:justify-end md:px-6",
        className,
      )}
    >
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </button>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <UserAvatar name={user.name} imageUrl={user.imageUrl} />
      </div>
    </header>
  );
};

export { Header };
