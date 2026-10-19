"use client";

import { useState } from "react";

export default function SourceBanner({
  degraded,
  message,
  hint,
  dismissLabel,
}: {
  readonly degraded: string[];
  readonly message?: string;
  readonly hint?: string;
  readonly dismissLabel?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || degraded.length === 0) {
    return null;
  }

  const text = (
    message ??
    "Showing bundled seed content because {count} content source(s) could not be reached"
  ).replace("{count}", String(degraded.length));

  return (
    <div className="source-banner" role="status">
      <div className="source-banner__inner">
        <span className="source-banner__mark">{text}</span>
        {hint && <span className="source-banner__hint">{hint}</span>}
        <button
          type="button"
          className="source-banner__dismiss"
          onClick={() => setDismissed(true)}
        >
          {dismissLabel ?? "Dismiss"}
        </button>
      </div>
    </div>
  );
}
