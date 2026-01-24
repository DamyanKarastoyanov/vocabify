/**
 * Hash utilities for main/sub-page handling
 */

export const getCurrentHash = () => window.location.hash || "";

/**
 * Ensures the URL has '#index' hash without reloading or scrolling.
 * Uses history.replaceState to avoid adding a new entry.
 */
export const ensureIndexHash = () => {
    if (typeof window === "undefined") return;
    const { pathname, search, hash } = window.location;
    if (hash !== "#index") {
        window.history.replaceState(
            window.history.state,
            "",
            pathname + search + "#index",
        );
    }
};

/**
 * Strips any hash fragment from the current URL without reloading.
 */
export const stripHash = () => {
    if (typeof window === "undefined") return;
    const { pathname, search, hash } = window.location;
    if (hash) {
        window.history.replaceState(
            window.history.state,
            "",
            pathname + search,
        );
    }
};

/**
 * Returns the given href with '#index' appended.
 * Handles existing hash gracefully.
 * @param {string} href
 * @returns {string}
 */
export const withIndexHash = (href) => {
    if (!href) return "#index";
    try {
        const url = new URL(
            href,
            typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost",
        );
        url.hash = "index"; // URL will render as '#index'
        // Preserve relative form if original was relative
        const isAbsolute = /^https?:\/\//i.test(href);
        return isAbsolute
            ? url.toString()
            : url.pathname + url.search + url.hash;
    } catch (_) {
        // Fallback: naive append if parsing fails
        return href.includes("#")
            ? href.replace(/#.*/, "#index")
            : href + "#index";
    }
};
