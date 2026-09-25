import { useEffect, useState } from "react";

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timeout = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timeout);
  }, [seconds]);

  return { seconds, restart: () => setSeconds(initialSeconds) };
}
