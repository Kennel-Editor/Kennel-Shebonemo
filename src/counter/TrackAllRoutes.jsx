import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getOrCreateVisitorId } from "./getVisitorId";

export default function TrackAllRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    fetch("/.netlify/functions/countVisit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname, visitorId }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
