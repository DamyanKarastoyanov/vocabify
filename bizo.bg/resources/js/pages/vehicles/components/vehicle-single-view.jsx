/**
 * External dependencies
 */
import { useEffect, useState } from "react";

/**
 * Internal dependencies
 */
import useGetVehicleDetailsQuery from "@/pages/vehicles/data/use-get-vehicle-details-query";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import IconCar from "@/components/icons/car";
import IconDocument from "@/components/icons/document";
import IconPencilSimple from "@/components/icons/pencil-simple";
import IconTrash from "@/components/icons/trash";
import Icon from "@/components/icon/icon";
import IconButton from "@/components/icon-button/icon-button";
import Spinner from "@/components/spinner/spinner";
import Popper from "@/components/popper/popper";
import { formatDate } from "@/utils/formatting";

const VehicleSingleView = (props) => {
    const { vehicle, onEdit, deleteConfirmation } = props;

    const { isLoading: isLoadingDetails, data: vehicleDetails } =
        useGetVehicleDetailsQuery(vehicle?.id);

    if (!vehicle && !isLoadingDetails) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    if (isLoadingDetails || !vehicleDetails) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    const renderInspectionStatus = () => {
        const isValid = vehicleDetails?.inspection?.is_valid;

        if (isValid === null || isValid === undefined) {
            return (
                <span className="bz-text-pending">Няма данни за преглед</span>
            );
        }

        if (isValid === true) {
            return <span className="bz-text-active">Валиден преглед</span>;
        }

        if (isValid === false) {
            return <span className="bz-text-declined">Невалиден преглед</span>;
        }
    };

    const renderMtplStatus = () => {
        const hasValidInsurance =
            vehicleDetails?.mtpl_check?.has_valid_insurance;

        if (hasValidInsurance === null || hasValidInsurance === undefined) {
            return <span className="bz-text-pending">Няма данни за ГО</span>;
        }

        if (hasValidInsurance === true) {
            return <span className="bz-text-active">Валидна ГО</span>;
        }

        return <span className="bz-text-declined">Невалидна ГО</span>;
    };

    const renderVignetteStatus = () => {
        const vignette = vehicleDetails?.vignette_check;
        const hasValidVignette = vignette?.has_valid_vignette;
        const hasAnyDates = Boolean(vignette?.valid_from || vignette?.valid_to);

        if (hasValidVignette === null || hasValidVignette === undefined) {
            if (vignette && !hasAnyDates) {
                return (
                    <span className="bz-text-declined">
                        Няма активна винетка
                    </span>
                );
            }

            return (
                <span className="bz-text-pending">Няма данни за винетка</span>
            );
        }

        if (hasValidVignette === true) {
            return <span className="bz-text-active">Валидна винетка</span>;
        }

        return <span className="bz-text-declined">Няма активна винетка</span>;
    };

    const renderVehicleCard = () => {
        const renderDetailRow = (label, value) => {
            if (!value && value !== 0 && value !== false) return null;
            return (
                <div className="bz-vehicle-detail-row">
                    <Text variant="body-s" color="text-secondary">
                        {label}:
                    </Text>
                    <div className="bz-vehicle-detail-separator" />
                    {typeof value === "string" || typeof value === "number" ? (
                        <Text variant="body-s">{value}</Text>
                    ) : (
                        value
                    )}
                </div>
            );
        };

        const renderDate = (value) => {
            if (!value) return "N/A";
            return formatDate(value, "dd.MM.yyyy");
        };

        return (
            <div className="bz-vehicle-single-view-card">
                <div className="bz-vehicle-single-view-card__left">
                    <BlockStack gap="800">
                        <InlineStack gap="400">
                            <Icon icon={IconCar} size="1400" />
                            <BlockStack gap="0">
                                <Text variant="body-s" color="text-secondary">
                                    Автомобил
                                </Text>
                            </BlockStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            <Text variant="heading-l" fontWeight="bold">
                                {vehicleDetails?.title || "N/A"}
                            </Text>
                        </BlockStack>
                    </BlockStack>
                </div>

                <div className="bz-vehicle-single-view-card__right">
                    <BlockStack gap="400">
                        <InlineStack
                            gap="400"
                            align="space-between"
                            className="bz-vehicle-details-header"
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
                            {renderDetailRow(
                                "Регистрационен номер",
                                vehicleDetails?.reg_number,
                            )}
                            {renderDetailRow("VIN", vehicleDetails?.vin)}
                            {renderDetailRow("Талон", vehicleDetails?.talon)}
                            {renderDetailRow(
                                "Марка и модел",
                                vehicleDetails?.specification?.mark &&
                                    vehicleDetails?.specification?.model
                                    ? `${vehicleDetails.specification.mark} ${vehicleDetails.specification.model}`
                                    : null,
                            )}
                            {renderDetailRow(
                                "Година на производство",
                                vehicleDetails?.specification
                                    ?.manufactured_year,
                            )}
                            {renderDetailRow(
                                "Обем на двигателя",
                                vehicleDetails?.specification?.engine_volume
                                    ? `${vehicleDetails.specification.engine_volume} см³`
                                    : null,
                            )}
                            {renderDetailRow(
                                "Мощност",
                                vehicleDetails?.specification?.engine_power
                                    ? `${vehicleDetails.specification.engine_power} кВ`
                                    : null,
                            )}
                            {renderDetailRow(
                                "Екологичен стандарт",
                                vehicleDetails?.specification?.euro_standard,
                            )}
                            {vehicleDetails?.inspection && (
                                <>
                                    {renderDetailRow(
                                        "Статус на преглед",
                                        renderInspectionStatus(),
                                    )}
                                    {renderDetailRow(
                                        "Следващ преглед",
                                        renderDate(
                                            vehicleDetails.inspection
                                                .next_inspection_date,
                                        ),
                                    )}
                                    {renderDetailRow(
                                        "Периодичен",
                                        vehicleDetails.inspection.is_periodic
                                            ? "Да"
                                            : "Не",
                                    )}
                                </>
                            )}
                            {vehicleDetails?.mtpl_check && (
                                <>
                                    {renderDetailRow(
                                        "Статус на ГО",
                                        renderMtplStatus(),
                                    )}
                                    {renderDetailRow(
                                        "ГО валидна от",
                                        renderDate(
                                            vehicleDetails.mtpl_check
                                                .start_date,
                                        ),
                                    )}
                                    {renderDetailRow(
                                        "ГО валидна до",
                                        renderDate(
                                            vehicleDetails.mtpl_check.end_date,
                                        ),
                                    )}
                                    {renderDetailRow(
                                        "Застраховател",
                                        vehicleDetails.mtpl_check.insurer,
                                    )}
                                </>
                            )}
                            {vehicleDetails?.vignette_check && (
                                <>
                                    {renderDetailRow(
                                        "Статус на винетка",
                                        renderVignetteStatus(),
                                    )}
                                    {renderDetailRow(
                                        "Винетка валидна от",
                                        renderDate(
                                            vehicleDetails.vignette_check
                                                .valid_from,
                                        ),
                                    )}
                                    {renderDetailRow(
                                        "Винетка валидна до",
                                        renderDate(
                                            vehicleDetails.vignette_check
                                                .valid_to,
                                        ),
                                    )}
                                    {renderDetailRow(
                                        "Номер на винетка",
                                        vehicleDetails.vignette_check
                                            .vignette_number,
                                    )}
                                    {renderDetailRow(
                                        "Държава",
                                        vehicleDetails.vignette_check.country,
                                    )}
                                </>
                            )}
                        </BlockStack>
                    </BlockStack>
                </div>
            </div>
        );
    };

    return (
        <BlockStack className="bz-vehicle-single-view" gap="800">
            {renderVehicleCard()}
        </BlockStack>
    );
};

export default VehicleSingleView;
