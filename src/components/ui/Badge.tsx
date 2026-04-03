import clsx from "clsx";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "green" | "yellow" | "red" | "blue" | "gray";
}

const variants = {
  green: "bg-emerald-100 text-emerald-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
};

export function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
