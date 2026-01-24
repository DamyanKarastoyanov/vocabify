import Select from '@/components/select/select';
import Button from '@/components/button/button';

export default {
    title: 'Pastel/Select',
    component: Select,
    argTypes: {
        disabled: {
            control: 'boolean',
            description: 'Disables the select input if set to true',
            defaultValue: false,
        },
        invalid: {
            control: 'boolean',
            description: 'Applies an invalid style if set to true',
            defaultValue: false,
        },
        maxMenuHeight: {
            control: 'number',
            description: 'Specifies the maximum height of the dropdown menu',
            defaultValue: 400,
        },
        minMenuHeight: {
            control: 'number',
            description: 'Specifies the minimum height of the dropdown menu',
            defaultValue: 140,
        },
        isSearchable: {
            control: 'boolean',
            description: 'Enables a search input within the dropdown menu',
            defaultValue: false,
        },
        customPlaceholder: {
            control: 'text',
            description: 'Custom placeholder text for the select input',
        },
        wrap: {
            control: 'boolean',
            description: 'Applies a wrapped style to the select input if set to true',
            defaultValue: false,
        },
    },
};

const options = [
    { value: '1', label: 'Business Name' },
    { value: '2', label: 'Brand' },
    { value: '3', label: 'Subregion' },
    { value: '4', label: 'Latest Reviews' },
    { value: '5', label: 'Response Rate' },
    { value: '6', label: 'More info' },
    { value: '7', label: 'Business Stats' },
    { value: '8', label: 'Tier' },
    { value: '10', label: 'Country' },
    { value: '11', label: 'Unresponded Reviews' },
    { value: '12', label: 'Business Type' },
    { value: '13', label: 'Business Status' },
    { value: '14', label: 'Business ID' },
    { value: '15', label: 'Business Owner' },
    { value: '16', label: 'Business Email' },
    { value: '17', label: 'Business Phone' },
    { value: '18', label: 'Business Address' },
    { value: '19', label: 'Business Website' },
    { value: '20', label: 'Business Description' },
    { value: '21', label: 'Business Tags' },
    { value: '22', label: 'Business Categories' },
    { value: '23', label: 'Business Subcategories' },
    { value: '24', label: 'Business Features' },
    { value: '25', label: 'Business Services' },
    { value: '26', label: 'Business Hours' },
    { value: '27', label: 'Business Social Media' },
    { value: '28', label: 'Business Photos' },
    { value: '29', label: 'Business Videos' },
    { value: '30', label: 'Business Menu' },
    { value: '31', label: 'Business Amenities' },
    { value: '32', label: 'Business Payment Methods' },
    { value: '33', label: 'Business Booking Methods' },
    { value: '34', label: 'Business Booking URL' },
    { value: '35', label: 'Business Booking Phone' },
    { value: '36', label: 'Business Booking Email' },
    { value: '37', label: 'Business Booking Address' },
    { value: '38', label: 'Business Booking Hours' },
    { value: '39', label: 'Business Booking Social Media' },
    { value: '40', label: 'Business Booking Photos' },
    { value: '41', label: 'Business Booking Videos' },
    { value: '42', label: 'Business Booking Menu' },
    { value: '43', label: 'Business Booking Amenities' },
    { value: '44', label: 'Business Booking Payment Methods' },
    { value: '45', label: 'Business Booking Services' },
    { value: '46', label: 'Business Booking Reviews' },
    { value: '47', label: 'Business Booking Stats' },
    { value: '48', label: 'Business Booking Tags' },
    { value: '49', label: 'Business Booking Categories' },
    { value: '50', label: 'Business Booking Subcategories' },
    { value: '51', label: 'Business Booking Features' },
    { value: '52', label: 'Business Booking Owner' },
    { value: '53', label: 'Business Booking Email' },
    { value: '54', label: 'Business Booking Phone' },
    { value: '55', label: 'Business Booking Address' },
    { value: '56', label: 'Business Booking Website' },
    { value: '57', label: 'Business Booking Description' },
    { value: '58', label: 'Business Booking Tags' },
    { value: '59', label: 'Business Booking Categories' },
    { value: '60', label: 'Business Booking Subcategories' },
    { value: '61', label: 'Business Booking Features' },
    { value: '62', label: 'Business Booking Services' },
    { value: '63', label: 'Business Booking Hours' },
    { value: '64', label: 'Business Booking Social Media' },
    { value: '65', label: 'Business Booking Photos' },
    { value: '66', label: 'Business Booking Videos' },
    { value: '67', label: 'Business Booking Menu' },
    { value: '68', label: 'Business Booking Amenities' },
    { value: '69', label: 'Business Booking Payment Methods' },
    { value: '70', label: 'Business Booking Reviews' },
    { value: '71', label: 'Business Booking Stats' },
    { value: '72', label: 'Business Booking Tags' },
    { value: '73', label: 'Business Booking Categories' },
    { value: '74', label: 'Business Booking Subcategories' },
    { value: '75', label: 'Business Booking Features' },
    { value: '76', label: 'Business Booking Services' },
    { value: '77', label: 'Business Booking Hours' },
    { value: '78', label: 'Business Booking Social Media' },
    { value: '79', label: 'Business Booking Photos' },
];

export const Default = {
    args: {
        options,
        maxMenuHeight: 200,
        placeholder: 'Select option',
    },
    render: (args) => (
        <div style={{ maxWidth: '500px' }}>
            <Select {...args} />
        </div>
    ),
};

export const MultiSelect = {
    args: {
        options,
        isMulti: true,
        isClearable: false,
        closeMenuOnSelect: false,
        placeholder: 'Select options',
    },
    render: (args) => (
        <div style={{ maxWidth: '500px' }}>
            <Select {...args} />
        </div>
    ),
};

export const MultiSelectWithSelectedLabelClickHandler = {
    args: {
        options,
        isMulti: true,
        isClearable: false,
        closeMenuOnSelect: false,
        placeholder: 'Select options',
        onClickSelectedLabel: (data) => {
            alert(`The item value is ${data.value}`);
        },
    },
    render: (args) => (
        <div style={{ maxWidth: '500px' }}>
            <Select {...args} />
        </div>
    ),
};

export const WithMenuListPrefix = {
    args: {
        options,
        placeholder: 'Select option',
        menuListPrefix: (
            <>
                <Button
                    //prefix={<Icon size="400" icon={IconArrowCounterClockwise} />}
                    variant="plain"
                    onClick={() => alert('Reset columns clicked!')}
                >
                    Reset Columns
                </Button>
            </>
        ),
    },
    render: (args) => (
        <div style={{ maxWidth: '500px' }}>
            <Select {...args} />
        </div>
    ),
};

export const InvalidState = {
    args: {
        options,
        invalid: true,
        placeholder: 'Select option',
    },
    render: (args) => (
        <div style={{ maxWidth: '500px' }}>
            <Select {...args} />
        </div>
    ),
};
