"use client";

import { cn } from "@/lib/utils";
import React from "react";

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  onclick?: () => void;
  isActive?: boolean;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  onclick,
  isActive = false,
}) => {
  return (
    <div
      className={cn(
        "w-full min-w-[25%] min-h-20 flex flex-col justify-center p-4 border rounded shadow-sm",
        isActive && "border-primary bg-primary/10",
      )}
      onClick={onclick}
    >
      <div className="flex items-center gap-4 ">
        {icon && <div className="">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
