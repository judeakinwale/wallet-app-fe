"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/user";

type HeaderProps = {
  className?: string;
  onMenuToggle?: () => void;
};

function UserAvatar({ name = "", imageUrl }: Partial<User>) {
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

const Header: React.FC<HeaderProps> = ({ className, onMenuToggle }) => {
  const { user } = useAuth();
  const imgUrl = user?.imageUrl || "https://picsum.photos/100";

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
        <span className="flex flex-col gap-0.5">
          {user?.name && (
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
          )}
          {user?.email && (
            <span className="text-xs font-light text-muted-foreground">
              {user.email}
            </span>
          )}
        </span>
        <UserAvatar name={user?.name} imageUrl={imgUrl} />
      </div>
    </header>
  );
};

export { Header };
