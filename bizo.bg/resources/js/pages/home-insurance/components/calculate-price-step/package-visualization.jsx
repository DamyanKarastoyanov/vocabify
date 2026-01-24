/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import MinMaxAmount from "@/pages/home-insurance/components/calculate-price-step/min-max-amount";
import useDebouncedFunction from "@/hooks/use-debounced-function";
import Tooltip from "@/components/tooltip/tooltip";
import IconRiskFire from "@/components/icons/risk-fire";
import IconRiskWind from "@/components/icons/risk-wind";
import IconRiskFrozen from "@/components/icons/risk-frozen";
import IconRiskEarthquake from "@/components/icons/risk-earthquake";
import IconRiskLiability from "@/components/icons/risk-liability";
import IconRiskCleanup from "@/components/icons/risk-cleanup";
import IconRiskAccident from "@/components/icons/risk-accident";
import IconRiskWaterDamage from "@/components/icons/risk-water-damage";
import IconRiskVandalism from "@/components/icons/risk-vandalism";
import IconRiskGlass from "@/components/icons/risk-glass";
import IconRiskRelocation from "@/components/icons/risk-relocation";
import IconRiskVehicleCollision from "@/components/icons/risk-vehicle-collision";
import IconRiskElectricShock from "@/components/icons/risk-electric-shock";
import IconRiskAccommodation from "@/components/icons/risk-accommodation";
import IconRiskPlumbingDetection from "@/components/icons/risk-plumbing-detection";
import IconRiskDoorFence from "@/components/icons/risk-door-fence";
import IconRiskLockKey from "@/components/icons/risk-lock-key";
import IconRiskTheft from "@/components/icons/risk-theft";
import IconRiskRefrigerator from "@/components/icons/risk-refrigerator";
import IconRiskInternalBreakage from "@/components/icons/risk-internal-breakage";

const PackageVisualization = (props) => {
    const {
        code,
        name,
        icon,
        tariff,
        maxInsuranceAmount,
        minInsuranceAmount,
        risks,
        previousPackageName,
        additionalRisks,
        amount,
        onAmountChange,
        isSelected,
    } = props;

    const debouncedAmountChange = useDebouncedFunction((value) => {
        onAmountChange(value);
    }, 300);

    // Map risk codes to their icon components
    const RISK_ICON_MAP = {
        A: IconRiskFire,
        Б1: IconRiskWind,
        Б2: IconRiskFrozen,
        Д1: IconRiskVehicleCollision,
        Д2: IconRiskWaterDamage,
        Д3: IconRiskElectricShock,
        З: IconRiskEarthquake,
        Кр: IconRiskTheft,
        В: IconRiskVandalism,
        Го: IconRiskLiability,
        Рр: IconRiskCleanup,
        Рн: IconRiskAccommodation,
        Чс1: IconRiskGlass,
        Рп: IconRiskRelocation,
        АХ1: IconRiskRefrigerator,
        АХ2: IconRiskPlumbingDetection,
        АХ3: IconRiskDoorFence,
        АХ4: IconRiskLockKey,
        АХ5: IconRiskAccident,
        АХ6: IconRiskInternalBreakage,
    };

    const renderRiskIcons = (riskList = [], isAdditional = false) => {
        if (!riskList?.length) {
            return null;
        }

        return riskList.map((risk) => {
            const RiskIcon = RISK_ICON_MAP[risk.shortCode];
            if (!RiskIcon) return null;

            return (
                <Tooltip key={risk.id} placement="bottom-start">
                    <Tooltip.Trigger asChild>
                        <div
                            className={classNames(
                                "bz-package-visualization__risk-icon",
                                {
                                    "bz-package-visualization__risk-icon--additional":
                                        isAdditional,
                                },
                            )}
                        >
                            {RiskIcon}
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content maxWidth="200px">
                        <Text variant="body-s">{risk.name}</Text>
                    </Tooltip.Content>
                </Tooltip>
            );
        });
    };

    return (
        <div
            className={classNames("bz-package-visualization-wrapper", {
                "bz-package-visualization-wrapper--selected": isSelected,
            })}
        >
            <div className="bz-package-visualization-card">
                <div className="bz-package-visualization-card__header">
                    <InlineStack gap="400" blockAlign="center">
                        {icon && (
                            <div className="bz-package-visualization-card__icon-badge">
                                <Icon icon={icon} size="800" />
                            </div>
                        )}
                        <Text variant="heading-m">{name}</Text>
                    </InlineStack>
                </div>

                <div className="bz-package-visualization-card__slider">
                    {isSelected ? (
                        <MinMaxAmount
                            minValue={minInsuranceAmount}
                            maxValue={maxInsuranceAmount}
                            value={amount}
                            onChange={debouncedAmountChange}
                        />
                    ) : (
                        <MinMaxAmount
                            minValue={minInsuranceAmount}
                            maxValue={maxInsuranceAmount}
                        />
                    )}
                </div>
            </div>

            <div className="bz-package-visualization-risks">
                {additionalRisks && additionalRisks.length > 0 ? (
                    <>
                        {previousPackageName && (
                            <Text variant="body-m" color="text-secondary">
                                {previousPackageName} +
                            </Text>
                        )}
                        <div className="bz-package-visualization-risks__icons">
                            {renderRiskIcons(additionalRisks, false)}
                        </div>
                    </>
                ) : (
                    <div className="bz-package-visualization-risks__icons">
                        {previousPackageName && (
                            <Text variant="body-m" color="text-secondary">
                                {previousPackageName} +
                            </Text>
                        )}
                        {renderRiskIcons(risks, false)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackageVisualization;
