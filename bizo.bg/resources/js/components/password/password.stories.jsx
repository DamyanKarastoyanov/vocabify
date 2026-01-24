/**
 * Internal dependencies
 */

import Password from "@/components/password/password";

export default {
    title: "Pastel/Password",
    component: Password,
    argTypes: {
        placeholder: {
            control: {
                type: "text",
            },
        },
    },
};

export const Default = {
    args: {
        disabled: false,
        placeholder: "Enter your password",
    },

    render: (args) => {
        return <Password {...args} />;
    },
};

export const Disabled = {
    args: {
        placeholder: "Enter your password",
        disabled: true,
    },

    render: (args) => {
        return <Password {...args} />;
    },
};
