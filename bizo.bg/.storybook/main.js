/**
 * @type {import('@storybook/react-vite').StorybookConfig}
 */
const config = {
    stories: ['../resources/**/*.stories.@(jsx|js)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {},
};

export default config;
