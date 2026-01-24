/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import ProfileForm from "@/pages/profile/components/profile-form";

const Profile = () => {
    return (
        <BlockStack className="bz-profile" gap="400">
            <BlockStack className="bz-profile" gap="400">
                <ProfileForm />
            </BlockStack>
        </BlockStack>
    );
};

export default AuthenticatedLayout.wrap(Profile, { headerbarTitle: "Профил" });
