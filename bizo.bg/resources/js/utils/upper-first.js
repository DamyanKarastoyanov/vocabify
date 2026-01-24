/**
 * Uppercase the first letter of a given string.
 *
 * @param {string} string
 * @return {string}
 */
export default function upperFirst(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}
