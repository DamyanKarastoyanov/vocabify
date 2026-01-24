/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import BlockStack from "@/components/block-stack/block-stack";
import MakeProfilePhone from "@assets/make_profile_phone.png";

const CreateProfile = () => {
    return (
        <section className="bz-create-profile">
            <div className="bz-create-profile__background-gradient" />

            <div className="bz-create-profile__container">
                <div className="bz-create-profile__content">
                    <BlockStack gap="600" inlineAlign="start">
                        <Text variant="heading-xl" color="white">
                            Направи си профил
                            <br />и спри да го мислиш.
                        </Text>

                        <Button
                            variant="primary"
                            onClick={() => router.visit(route("register"))}
                        >
                            Направи си профил
                        </Button>
                    </BlockStack>
                </div>
            </div>

            <div className="bz-create-profile__phone">
                <img
                    src={MakeProfilePhone}
                    alt="Bizo mobile app"
                    className="bz-create-profile__phone-image"
                />

                <div className="bz-create-profile__mobile-background-gradient" />
            </div>
        </section>
    );
};

export default CreateProfile;
