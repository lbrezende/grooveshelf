"use client";

import Link from "next/link";

interface TrialBannerProps {
  daysLeft: number;
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2">
      <p className="text-sm font-medium text-amber-300">
        <span className="mr-1.5" aria-hidden>
          &#9203;
        </span>
        {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"} no trial
      </p>
      <Link
        href="/pricing"
        className="inline-flex h-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 px-2.5 text-xs font-semibold text-black transition-colors hover:bg-amber-400"
      >
        Fazer upgrade
      </Link>
    </div>
  );
}
