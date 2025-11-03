import { useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "./getVisitorId";

export function useTrackVisit(pageSlug) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!pageSlug || sentRef.current) return;
    sentRef.current = true;

    const visitorId = getOrCreateVisitorId();

    fetch("/.netlify/functions/countVisit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pageSlug, visitorId }),
      keepalive: true,
    }).catch(() => {});
  }, [pageSlug]);
}
