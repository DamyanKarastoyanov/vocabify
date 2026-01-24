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
import IconProperty from "@/components/icons/property";
import IconDocument from "@/components/icons/document";
import IconPencilSimple from "@/components/icons/pencil-simple";
import IconTrash from "@/components/icons/trash";
import Icon from "@/components/icon/icon";
import IconButton from "@/components/icon-button/icon-button";
import Spinner from "@/components/spinner/spinner";
import Popper from "@/components/popper/popper";

const PropertySingleView = (props) => {
    const { property, onEdit, deleteConfirmation } = props;

    if (!property) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    const [address, town, municipality, district, postalCode] =
        property.address?.split(", ") ?? [];

    const renderPropertyCard = () => {
        return (
            <div className="bz-property-single-view-card">
                <div className="bz-property-single-view-card__left">
                    <BlockStack gap="800">
                        <InlineStack gap="400">
                            <Icon icon={IconProperty} size="1400" />
                            <BlockStack gap="0">
                                <Text variant="body-s" color="text-secondary">
                                    Имот
                                </Text>
                            </BlockStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            <Text variant="heading-l" fontWeight="bold">
                                {address || "N/A"}
                                {town && `, ${town}`}
                                {postalCode && `, ${postalCode}`}
                            </Text>
                        </BlockStack>
                    </BlockStack>
                </div>

                <div className="bz-property-single-view-card__right">
                    <BlockStack gap="400">
                        <InlineStack
                            gap="400"
                            align="space-between"
                            className="bz-property-details-header"
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
                            <div className="bz-property-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Адрес:
                                </Text>
                                <div className="bz-property-detail-separator" />
                                <Text variant="body-s">
                                    {property.address || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-property-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Площ:
                                </Text>
                                <div className="bz-property-detail-separator" />
                                <Text variant="body-s">
                                    {property.gross_floor_area
                                        ? `${property.gross_floor_area} кв.м`
                                        : "N/A"}
                                </Text>
                            </div>

                            {municipality && (
                                <div className="bz-property-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Община:
                                    </Text>
                                    <div className="bz-property-detail-separator" />
                                    <Text variant="body-s">{municipality}</Text>
                                </div>
                            )}

                            {district && (
                                <div className="bz-property-detail-row">
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Област:
                                    </Text>
                                    <div className="bz-property-detail-separator" />
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
        <BlockStack className="bz-property-single-view" gap="800">
            {renderPropertyCard()}
        </BlockStack>
    );
};

export default PropertySingleView;
