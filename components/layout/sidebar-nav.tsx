"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "\u{1F3B5}" },
  { href: "/app/library", label: "Library", icon: "\u{1F4BF}" },
  { href: "/app/wishlist", label: "Wishlist", icon: "\u2764" },
  { href: "/app/listening", label: "Listening Diary", icon: "\u{1F3A7}" },
  { href: "/app/monthly", label: "Monthly List", icon: "\u{1F4C5}" },
];

const bottomNavItems = [
  { href: "/settings/billing", label: "Billing", icon: "\u{1F4B3}" },
];

interface SidebarNavProps {
  className?: string;
  onNavClick?: () => void;
}

export function SidebarNav({ className, onNavClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex h-full flex-col bg-sidebar",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <div className="h-3 w-3 rounded-full bg-card" />
          <div className="absolute h-1 w-1 rounded-full bg-primary" />
        </div>
        <span className="text-lg font-bold text-white">GrooveShelf</span>
      </div>

      <Separator className="bg-white/10" />

      {/* Main nav links */}
      <div className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="text-base" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom nav links */}
      <div className="space-y-1 px-2 py-3">
        {bottomNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="text-base" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
