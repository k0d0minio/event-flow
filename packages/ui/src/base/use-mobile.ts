"use client";

import { useEffect, useState, useCallback } from "react";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const checkDevice = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile((prev) => (prev !== mobile ? mobile : prev));
  }, []);

  useEffect(() => {
    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, [checkDevice]);

  return isMobile;
};
