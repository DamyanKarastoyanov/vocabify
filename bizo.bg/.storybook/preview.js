/**
 * Internal dependencies
 */
import '../resources/scss/app.scss';

/**
 * @type {import('@storybook/react').Preview}
 */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },

    tags: ['autodocs'],
};

export default preview;
