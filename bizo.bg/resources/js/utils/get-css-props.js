/**
 * Internal dependencies
 */
import identity from '@/utils/identity';

/**
 * Convert given props to CSS custom properties.
 *
 * @param {string} componentName
 * @param {Array} props
 * @return {Object}
 */
export default function getCssProps(componentName, props) {
    return props.reduce((memo, [name, value, transform = identity]) => {
        if (typeof value === 'undefined') {
            return memo;
        }

        name = `--bz-${componentName}-${name}`;

        memo[name] = transform(value);

        return memo;
    }, {});
}
