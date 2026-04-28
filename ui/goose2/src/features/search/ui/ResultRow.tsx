interface ResultRowProps {
  title: string;
  meta: string;
  ariaLabel: string;
  onClick: () => void;
}

export function ResultRow({ title, meta, ariaLabel, onClick }: ResultRowProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="group flex w-[222px] flex-col items-start gap-1 text-left font-sans outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-muted-alex)]"
      style={{ fontFamily: "var(--font-sans-alex)" }}
    >
      <span className="line-clamp-2 w-full break-words text-[16px] leading-5 text-[#242424] group-hover:text-black group-active:opacity-70">
        {title}
      </span>
      <span className="line-clamp-2 w-full break-words text-[10px] leading-normal text-[#7f7f7f]">
        {meta}
      </span>
    </button>
  );
}
