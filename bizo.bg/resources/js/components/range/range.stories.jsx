/**
 * External dependencies
 */
import { useState } from "react";

/**
 * Internal dependencies
 */
import Range from "@/components/range/range";

export default {
    title: "Components/Range",
    component: Range,
    parameters: {
        docs: {
            description: {
                component:
                    'A customizable range slider component that wraps a native input type="range" with labeled options.',
            },
        },
    },
    argTypes: {
        value: {
            control: { type: "number", min: 0, max: 4, step: 1 },
            description: "Current value of the range",
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the range is disabled",
        },
        onChange: {
            action: "changed",
            description: "Callback fired when the value changes",
        },
    },
};

const Template = (args) => {
    const [value, setValue] = useState(args.value || 0);

    return (
        <Range
            {...args}
            value={value}
            onChange={setValue}
            min={0}
            max={4}
            step={1}
        >
            <Range.Option value="0" label="Very dissatisfied" />
            <Range.Option value="1" />
            <Range.Option value="2" />
            <Range.Option value="3" />
            <Range.Option value="4" label="Very satisfied" />
        </Range>
    );
};

export const Default = Template.bind({});
Default.args = {
    value: 2,
    disabled: false,
};

export const WithCustomLabels = Template.bind({});
WithCustomLabels.args = {
    value: 1,
    disabled: false,
};
WithCustomLabels.parameters = {
    docs: {
        description: {
            story: "Range component with custom labels on all options.",
        },
    },
};

export const Disabled = Template.bind({});
Disabled.args = {
    value: 3,
    disabled: true,
};

export const SatisfactionSurvey = (args) => {
    const [value, setValue] = useState(args.value || 0);

    return (
        <Range {...args} value={value} onChange={setValue}>
            <Range.Option value="0" label="Very dissatisfied" />
            <Range.Option value="1" label="Dissatisfied" />
            <Range.Option value="2" label="Neutral" />
            <Range.Option value="3" label="Satisfied" />
            <Range.Option value="4" label="Very satisfied" />
        </Range>
    );
};
SatisfactionSurvey.args = {
    value: 2,
    disabled: false,
};
SatisfactionSurvey.parameters = {
    docs: {
        description: {
            story: "Range component configured for a satisfaction survey with labels on all options.",
        },
    },
};

export const MinimalOptions = (args) => {
    const [value, setValue] = useState(args.value || 0);

    return (
        <Range
            {...args}
            value={value}
            onChange={setValue}
            min={0}
            max={1}
            step={1}
        >
            <Range.Option value="0" label="No" />
            <Range.Option value="1" label="Yes" />
        </Range>
    );
};
MinimalOptions.args = {
    value: 0,
    disabled: false,
};
MinimalOptions.parameters = {
    docs: {
        description: {
            story: "Range component with only two options for yes/no scenarios.",
        },
    },
};
