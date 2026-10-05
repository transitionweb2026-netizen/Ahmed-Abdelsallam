"use client";

import { useEffect, useState } from "react";

/** A timestamp in the reader's own time zone (formatted after hydration). */
export function LocalTime({ iso, withYear }: { iso: string; withYear?: boolean }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: withYear ? "numeric" : undefined, hour: "2-digit", minute: "2-digit" });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the time zone is only known in the browser
    setText(format.format(new Date(iso)));
  }, [iso, withYear]);
  return (
    <time dateTime={iso} className="flex-none text-xs text-muted">
      {text ?? iso.slice(0, 10)}
    </time>
  );
}
