"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TrialBanner } from "@/components/paywall/trial-banner";

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTrialDaysLeft(trialEndsAt: Date | string | null): number | null {
  if (!trialEndsAt) return null;
  const end = new Date(trialEndsAt);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user;
  const isTrialPlan = user?.plan === "TRIAL";
  const trialDaysLeft = isTrialPlan ? getTrialDaysLeft(user?.trialEndsAt ?? null) : null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-white/5 md:block">
        <SidebarNav className="h-full" />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Trial banner */}
        {isTrialPlan && trialDaysLeft !== null && (
          <TrialBanner daysLeft={trialDaysLeft} />
        )}

        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/5 px-4">
          {/* Mobile hamburger + sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="text-white" />
                }
              >
                <span className="text-lg">&#9776;</span>
                <span className="sr-only">Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 bg-card p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarNav onNavClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Spacer for desktop (no hamburger) */}
          <div className="hidden md:block" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-zinc-300 transition-colors hover:bg-white/5">
              <Avatar size="sm">
                {user?.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate sm:inline">
                {user?.name ?? user?.email}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card text-white border-white/10">
              <DropdownMenuItem className="text-zinc-400 focus:bg-white/5 focus:text-white" disabled>
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-zinc-300 focus:bg-white/5 focus:text-white cursor-pointer"
                onSelect={() => signOut({ callbackUrl: "/login" })}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
