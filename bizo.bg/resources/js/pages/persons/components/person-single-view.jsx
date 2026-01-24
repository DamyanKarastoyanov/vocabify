/**
 * External dependencies
 */
import { useEffect, useState } from "react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import IconUser from "@/components/icons/user";
import IconDocument from "@/components/icons/document";
import IconPencilSimple from "@/components/icons/pencil-simple";
import IconTrash from "@/components/icons/trash";
import Icon from "@/components/icon/icon";
import IconButton from "@/components/icon-button/icon-button";
import Spinner from "@/components/spinner/spinner";
import Popper from "@/components/popper/popper";

const PersonSingleView = (props) => {
    const { person, onEdit, deleteConfirmation } = props;

    if (!person) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    const [address, town, municipality, district, postalCode] =
        person.address?.split(", ") ?? [];

    const renderPersonCard = () => {
        return (
            <div className="bz-person-single-view-card">
                <div className="bz-person-single-view-card__left">
                    <BlockStack gap="800">
                        <InlineStack gap="400">
                            <Icon icon={IconUser} size="1400" />
                            <BlockStack gap="0">
                                <Text variant="body-s" color="text-secondary">
                                    Лице
                                </Text>
                            </BlockStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            <Text variant="heading-l" fontWeight="bold">
                                {person.first_name || "N/A"}{" "}
                                {person.last_name || ""}
                            </Text>
                        </BlockStack>
                    </BlockStack>
                </div>

                <div className="bz-person-single-view-card__right">
                    <BlockStack gap="400">
                        <InlineStack
                            gap="400"
                            align="space-between"
                            className="bz-person-details-header"
                            blockAlign="center"
                        >
                            <InlineStack gap="400">
                                <Icon icon={IconDocument} size="600" />
                                <Text variant="heading-s" fontWeight="semibold">
                                    Детайли
                                </Text>
                            </InlineStack>

                            <InlineStack gap="200">
                                {onEdit && (
                                    <IconButton
                                        icon={IconPencilSimple}
                                        onClick={onEdit}
                                        size="600"
                                        iconSize="600"
                                        color="brand-500"
                                    />
                                )}
                                {deleteConfirmation && (
                                    <Popper>
                                        <Popper.Trigger>
                                            <Icon
                                                icon={IconTrash}
                                                size="600"
                                                color="danger-500"
                                            />
                                        </Popper.Trigger>
                                        <Popper.Content>
                                            {deleteConfirmation}
                                        </Popper.Content>
                                    </Popper>
                                )}
                            </InlineStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            <div className="bz-person-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Име:
                                </Text>
                                <div className="bz-person-detail-separator" />
                                <Text variant="body-s">
                                    {person.first_name || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-person-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Фамилия:
                                </Text>
                                <div className="bz-person-detail-separator" />
                                <Text variant="body-s">
                                    {person.last_name || "N/A"}
                                </Text>
                            </div>

                            {person.personal_identification_number_type_name && (
                                <div className="bz-person-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        {
                                            person.personal_identification_number_type_name
                                        }
                                        :
                                    </Text>
                                    <div className="bz-person-detail-separator" />
                                    <Text variant="body-s">
                                        {person.personal_identification_number ||
                                            "N/A"}
                                    </Text>
                                </div>
                            )}

                            {person.address && (
                                <div className="bz-person-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Адрес:
                                    </Text>
                                    <div className="bz-person-detail-separator" />
                                    <Text variant="body-s">
                                        {person.address || "N/A"}
                                    </Text>
                                </div>
                            )}

                            {municipality && (
                                <div className="bz-person-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Община:
                                    </Text>
                                    <div className="bz-person-detail-separator" />
                                    <Text variant="body-s">{municipality}</Text>
                                </div>
                            )}

                            {district && (
                                <div className="bz-person-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Област:
                                    </Text>
                                    <div className="bz-person-detail-separator" />
                                    <Text variant="body-s">{district}</Text>
                                </div>
                            )}
                        </BlockStack>
                    </BlockStack>
                </div>
            </div>
        );
    };

    return (
        <BlockStack className="bz-person-single-view" gap="800">
            {renderPersonCard()}
        </BlockStack>
    );
};

export default PersonSingleView;
