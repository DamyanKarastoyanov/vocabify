import { useState, useEffect } from "react";

/**
 * Hook to detect screen size and determine if mobile/tablet layout should be used
 * Returns true for tablets and below (max-width: 1024px)
 */
export const useScreenSize = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 1024; // $bz-breakpoint-md
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};
