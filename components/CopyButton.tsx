"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="shrink-0 rounded border border-kopi-200 bg-white px-2 py-1 text-xs font-medium text-kopi-600 hover:bg-kopi-50"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
