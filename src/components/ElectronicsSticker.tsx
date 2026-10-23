import type { ComponentProps } from "react";

type StickerKind = "resistor" | "timer" | "capacitor" | "esp32" | "uart" | "analyzer" | "adapter";

type Props = {
  kind: StickerKind;
  note: string;
};

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} satisfies ComponentProps<"path">;

function Symbol({ kind }: { kind: StickerKind }) {
  switch (kind) {
    case "resistor":
      return (
        <>
          <path d="M5 28h7l4-9 8 18 8-18 8 18 4-9h7" {...common} strokeWidth="2.5" />
          <path d="M21 22v12M29 22v12M37 22v12" {...common} strokeWidth="2" />
          <path d="M5 28H2m49 0h-3" {...common} strokeWidth="2" />
        </>
      );
    case "timer":
      return (
        <>
          <path className="timer-chip" d="M17 17q0-2 3-2h16q3 0 3 2v16q0 2-3 2H20q-3 0-3-2Z" strokeWidth="1.8" />
          <path d="M20 15v-4m5 4v-4m5 4v-4m5 4v-4m-15 24v4m5-4v4m5-4v4m5-4v4M17 21h-5m5 5h-5m5 5h-5m27-10h5m-5 5h5m-5 5h5" {...common} strokeWidth="1.8" />
          <path d="M21 21q6-3 13 0m-13 6q6 3 13 0" {...common} strokeWidth="1.4" />
        </>
      );
    case "capacitor":
      return (
        <>
          <path d="M4 27h17m12 0h17M21 12v30m12-30v30" {...common} strokeWidth="2.6" />
          <path d="M24 15h6m-6 24h6" {...common} strokeWidth="1.5" />
        </>
      );
    case "esp32":
      return (
        <>
          <path d="M13 9h30v34H13z" {...common} strokeWidth="2" />
          <path d="M18 14h20v19H18zM22 38h12" {...common} strokeWidth="1.7" />
          <path d="M16 5v4m6-4v4m6-4v4m6-4v4m6-4v4M16 43v4m6-4v4m6-4v4m6-4v4m6-4v4M9 13h4m-4 6h4m-4 6h4m-4 6h4m-4 6h4m30-24h4m-4 6h4m-4 6h4m-4 6h4m-4 6h4" {...common} strokeWidth="1.2" />
          <path d="M21 24c4-4 8 4 13 0m-13 5c4-4 8 4 13 0" {...common} strokeWidth="1.5" />
        </>
      );
    case "uart":
      return (
        <>
          <path d="M11 10h34v30H11z" {...common} strokeWidth="2" />
          <path d="M17 10V5m8 5V5m8 5V5m8 5V5m-24 35v5m8-5v5m8-5v5m8-5v5" {...common} strokeWidth="1.7" />
          <circle cx="18" cy="21" r="2.3" fill="currentColor" stroke="none" />
          <circle cx="26" cy="21" r="2.3" fill="currentColor" stroke="none" />
          <circle cx="34" cy="21" r="2.3" fill="currentColor" stroke="none" />
          <circle cx="42" cy="21" r="2.3" fill="currentColor" stroke="none" />
          <path d="M16 30h24m-24 5h16" {...common} strokeWidth="1.5" />
        </>
      );
    case "analyzer":
      return (
        <>
          <path d="M8 15h8v18H8zM40 15h8v18h-8z" {...common} strokeWidth="2" />
          <path d="M12 33v7m32-7v7M16 24h7l4-8 7 17 5-9h4" {...common} strokeWidth="2.2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="44" cy="12" r="2" fill="currentColor" stroke="none" />
        </>
      );
    case "adapter":
      return (
        <>
          <path d="M19 14h22v24H19z" {...common} strokeWidth="2" />
          <path d="M24 14V7m5 7V7m5 7V7m5 7V7M19 20H9v12h10m22-6h8" {...common} strokeWidth="2" />
          <path d="M25 22h10v8H25zM28 34h4" {...common} strokeWidth="1.7" />
          <circle cx="39" cy="34" r="1.3" fill="currentColor" stroke="none" />
        </>
      );
  }
}

export default function ElectronicsSticker({ kind, note }: Props) {
  return (
    <span className="sticker-wrap" title={note}>
      <svg
        className={`component-sticker component-sticker--${kind}`}
        viewBox="0 0 56 52"
        role="img"
        aria-label={note}
      >
        <rect className="sticker-back" x="1" y="1" width="54" height="50" rx="5" />
        <Symbol kind={kind} />
        <path className="sticker-gloss" d="M6 5h43" />
      </svg>
      <span className="sticker-note" aria-hidden="true">{note}</span>
      <span className="sticker-peel" aria-hidden="true" />
    </span>
  );
}
