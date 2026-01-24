/**
 * Takes a dot-separated token name and an optional fallback, and returns the current computed CSS value for the
 * resulting CSS Custom Property.
 *
 * @param {string} path
 * @param {*} fallback
 * @return {*}
 */
export function token(path, fallback) {
    const cssPath = path.split(".").join("-");

    return (
        window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(`--vf-${cssPath}`)
            .trim() || fallback
    );
}
