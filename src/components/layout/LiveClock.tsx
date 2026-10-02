"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_TZ = "Asia/Kuala_Lumpur";

function formatters(timeZone: string) {
  return {
    day: new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long" }),
    time: new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    date: new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
}

export function LiveClock({
  className,
  timeZone = DEFAULT_TZ,
}: {
  className?: string;
  timeZone?: string;
}) {
  const f = useMemo(() => formatters(timeZone), [timeZone]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className={className} aria-hidden style={{ minHeight: "3.5em" }} />;

  return (
    <div className={className}>
      <p>{f.day.format(now)}</p>
      <p className="tabular-nums">{f.time.format(now)}</p>
      <p>{f.date.format(now)}</p>
    </div>
  );
}
