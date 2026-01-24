/**
 * External dependencies
 */
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";

const ProfileButtons = () => {
    const route = useRoute();

    return (
        <InlineStack
            gap="300"
            blockAlign="center"
            wrap={false}
            className="bz-profile-buttons__desktop-buttons"
        >
            <Button variant="primary" href={route("login")}>
                Вход
            </Button>
        </InlineStack>
    );
};

export default ProfileButtons;
