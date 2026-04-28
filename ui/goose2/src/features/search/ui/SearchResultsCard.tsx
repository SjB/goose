import type { ReactNode } from "react";
import { BottomFade } from "@/shared/ui/BottomFade";

interface SearchResultsCardProps {
  label: string;
  children: ReactNode;
}

export function SearchResultsCard({ label, children }: SearchResultsCardProps) {
  return (
    <section className="relative h-full min-h-[220px] w-[259px] flex-none animate-fade-in overflow-hidden rounded-[20px] bg-white/60 motion-reduce:animate-none">
      <h2
        className="absolute left-5 top-[21px] inline-flex h-5 items-center rounded-full bg-[#dedede] px-[6px] pb-[3px] text-[14px] text-[#19191a]"
        style={{ fontFamily: "var(--font-sans-alex)" }}
      >
        {label}
      </h2>

      <div className="absolute bottom-0 left-6 top-[59px] flex w-[222px] flex-col gap-6 overflow-y-auto pb-12 scrollbar-none">
        {children}
      </div>

      <BottomFade
        className="absolute bottom-0 left-0 h-20"
        surface="rgba(255,255,255,0.6)"
      />
    </section>
  );
}
