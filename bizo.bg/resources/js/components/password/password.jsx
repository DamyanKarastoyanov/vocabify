/**
 * External dependencies
 */
import { useState, forwardRef } from "react";

/**
 * Internal dependencies
 */
import IconButton from "@/components/icon-button/icon-button";
import IconEye from "@/components/icons/eye";
import TextInput from "@/components/text-input/text-input";
import IconEyeSlash from "@/components/icons/eye-slash";

const Password = forwardRef((props, ref) => {
    const { placeholder, ...restProps } = props;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextInput
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            suffix={
                <IconButton
                    size="600"
                    color="brand-500"
                    icon={showPassword ? IconEye : IconEyeSlash}
                    onClick={() => setShowPassword(!showPassword)}
                />
            }
            ref={ref}
            {...restProps}
        />
    );
});

export default Password;
