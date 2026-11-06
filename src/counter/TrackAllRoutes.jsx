import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { capturePageview } from "../analytics/posthog";

export default function TrackAllRoutes() {
  const { pathname, search, key } = useLocation();
  const lastNavigation = useRef(null);

  useEffect(() => {
    const navigation = `${key}:${pathname}${search}`;
    if (lastNavigation.current === navigation) return;
    lastNavigation.current = navigation;
    capturePageview(pathname);
  }, [pathname, search, key]);

  return null;
}
