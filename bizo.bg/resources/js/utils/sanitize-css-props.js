/**
 * Clean up any nullish styles.
 *
 * @param {Object} styles
 * @return {?Object}
 */
export default function sanitizeCssProperties(styles) {
    const nonNullishValues = Object.entries(styles).filter(([_, value]) => value != null && value != undefined);

    return nonNullishValues.length ? Object.fromEntries(nonNullishValues) : undefined;
}
