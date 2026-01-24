/**
 * External dependencies
 */
import { Fragment, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import IconCheck from "@/components/icons/check";

function ProcessProgressBar(props) {
    const { steps = [], currentStep = 1, lastVisitedStep } = props;

    const successStepKey = steps?.[steps.length - 1]?.key;
    const isOnSuccessStep = currentStep === successStepKey;
    const containerRef = useRef(null);
    const currentStepRef = useRef(null);
    const innerContainerRef = useRef(null);
    const [isMobileMode, setIsMobileMode] = useState(false);
    const checkTimeoutRef = useRef(null);
    const lastModeChangeRef = useRef(0);
    const lastContainerWidthRef = useRef(0);
    const isInitialMountRef = useRef(true);

    // Detect if content overflows and switch to mobile mode
    useEffect(() => {
        const checkOverflow = () => {
            // Prevent rapid checks
            const now = Date.now();
            const timeSinceLastChange = now - lastModeChangeRef.current;
            if (timeSinceLastChange < 300) {
                return;
            }

            if (containerRef.current && innerContainerRef.current) {
                const container = containerRef.current;
                const innerContainer = innerContainerRef.current;
                const containerWidth = container.clientWidth;

                // Skip check if container width hasn't changed (prevents feedback loop)
                // But always check on initial mount
                if (
                    !isInitialMountRef.current &&
                    containerWidth === lastContainerWidthRef.current
                ) {
                    return;
                }

                isInitialMountRef.current = false;
                lastContainerWidthRef.current = containerWidth;

                // Use double requestAnimationFrame to ensure DOM is fully rendered
                // after any style changes
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Temporarily remove mobile class to check overflow in full mode
                        const containerElement = container;
                        const wasMobile = containerElement.classList.contains(
                            "bz-process-progress--mobile",
                        );

                        if (wasMobile) {
                            containerElement.classList.remove(
                                "bz-process-progress--mobile",
                            );
                            // Force reflow to apply the change
                            void containerElement.offsetWidth;
                        }

                        // Measure content width in full mode
                        // In full mode, we have sequential layout, so measure scrollWidth directly
                        const contentWidth = innerContainer.scrollWidth;

                        // If content width exceeds container, we need mobile mode
                        const shouldBeMobile =
                            contentWidth > containerWidth + 2;

                        // Restore mobile class if it was there
                        if (wasMobile) {
                            if (shouldBeMobile) {
                                containerElement.classList.add(
                                    "bz-process-progress--mobile",
                                );
                            }
                            // If shouldBeMobile is false, keep it removed
                            // React will sync it via className prop
                        }

                        // Update state only if mode needs to change
                        if (shouldBeMobile !== isMobileMode) {
                            setIsMobileMode(shouldBeMobile);
                            lastModeChangeRef.current = Date.now();
                        }
                    });
                });
            }
        };

        // Debounced check function
        const debouncedCheck = () => {
            if (checkTimeoutRef.current) {
                clearTimeout(checkTimeoutRef.current);
            }
            checkTimeoutRef.current = setTimeout(checkOverflow, 150);
        };

        // Initial check with delay to ensure DOM is ready
        const initialTimeoutId = setTimeout(checkOverflow, 300);

        // Set up ResizeObserver to watch ONLY the container size changes
        // We don't observe innerContainer to avoid feedback loop when styles change
        const resizeObserver = new ResizeObserver((entries) => {
            // Only check if the container size changed
            for (const entry of entries) {
                if (entry.target === containerRef.current) {
                    debouncedCheck();
                    break;
                }
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Also listen to window resize with debouncing
        window.addEventListener("resize", debouncedCheck);

        return () => {
            clearTimeout(initialTimeoutId);
            if (checkTimeoutRef.current) {
                clearTimeout(checkTimeoutRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener("resize", debouncedCheck);
        };
    }, [steps, currentStep, isMobileMode]);

    useEffect(() => {
        if (containerRef.current && currentStepRef.current) {
            const container = containerRef.current;
            const currentElement = currentStepRef.current;

            // Get the container's width and the element's width
            const containerWidth = container.offsetWidth;
            const elementWidth = currentElement.offsetWidth;

            // Calculate the scroll position to center the element
            const scrollPosition =
                currentElement.offsetLeft -
                containerWidth / 2 +
                elementWidth / 2;

            container.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
        }
    }, [currentStep]);

    const handleStepClick = (step) => {
        router.reload({
            data: {
                step: step.key,
            },
            preserveScroll: false,
            onFinish: () => window.scrollTo(0, 0),
        });
    };

    const visibleSteps = steps.filter((step) => !step.hidden);

    // Helper function to get step number from visibleSteps array
    const getStepNumber = (stepKey) => {
        const index = visibleSteps.findIndex((s) => s.key === stepKey);
        return index >= 0 ? index : 1;
    };

    // Separate steps into completed/current (left) and upcoming (right) for mobile mode
    const completedAndCurrentSteps = visibleSteps.filter(
        (step) => step.key <= currentStep,
    );
    const upcomingSteps = visibleSteps.filter((step) => step.key > currentStep);

    const renderStep = (step, visibleIndex, isLastInGroup = false) => {
        const stepNumber = visibleIndex + 1;
        return (
            <Fragment key={step.key}>
                <div
                    ref={step.key === currentStep ? currentStepRef : null}
                    className={classNames("bz-process-progress__step", {
                        "bz-process-progress__step--clickable":
                            !isOnSuccessStep &&
                            step.key <= lastVisitedStep &&
                            step.key !== currentStep,
                    })}
                    onClick={
                        !isOnSuccessStep &&
                        step.key <= lastVisitedStep &&
                        step.key !== currentStep
                            ? () => handleStepClick(step)
                            : undefined
                    }
                    role={
                        !isOnSuccessStep &&
                        step.key <= lastVisitedStep &&
                        step.key !== currentStep
                            ? "button"
                            : undefined
                    }
                    style={
                        !isOnSuccessStep &&
                        step.key <= lastVisitedStep &&
                        step.key !== currentStep
                            ? { cursor: "pointer" }
                            : undefined
                    }
                >
                    <div
                        className={classNames(
                            "bz-process-progress__indicator",
                            {
                                "bz-process-progress__indicator--current":
                                    step.key === currentStep,
                                "bz-process-progress__indicator--upcoming":
                                    step.key > currentStep &&
                                    step.key > lastVisitedStep,
                                "bz-process-progress__indicator--visited":
                                    step.key > currentStep &&
                                    step.key <= lastVisitedStep,
                                "bz-process-progress__indicator--completed":
                                    step.key < currentStep,
                            },
                        )}
                    >
                        {step.key < currentStep ? (
                            <Icon icon={IconCheck} color="white" size="300" />
                        ) : null}
                    </div>

                    <BlockStack
                        gap="050"
                        inlineAlign="start"
                        className="bz-process-progress__text-container"
                    >
                        <Text variant="body-s" color="text-secondary">
                            {`Стъпка ${stepNumber}`}
                        </Text>
                        {step.label && (
                            <Text
                                variant="body-m"
                                color={
                                    step.key < currentStep
                                        ? "blue-200"
                                        : step.key === currentStep
                                          ? "dark-500"
                                          : "gray-500"
                                }
                            >
                                <span
                                    className="bz-process-progress__label-text"
                                    title={step.label}
                                >
                                    {step.label}
                                </span>
                            </Text>
                        )}
                    </BlockStack>
                </div>

                {!isLastInGroup && (
                    <div
                        className={classNames(
                            "bz-process-progress__connector",
                            {
                                "bz-process-progress__connector--completed":
                                    step.key < currentStep,
                            },
                        )}
                    />
                )}
            </Fragment>
        );
    };

    return (
        <Box
            className={classNames("bz-process-progress", {
                "bz-process-progress--mobile": isMobileMode,
            })}
            ref={containerRef}
        >
            <InlineStack
                className="bz-process-progress__container"
                wrap={false}
                ref={innerContainerRef}
            >
                {isMobileMode ? (
                    /* Mobile mode: Grouped layout with left/right groups */
                    <>
                        {/* Left group: Completed and current steps */}
                        <div className="bz-process-progress__left-group">
                            {completedAndCurrentSteps.map((step, index) => {
                                const stepNumber = getStepNumber(step.key);
                                return renderStep(
                                    step,
                                    stepNumber,
                                    index ===
                                        completedAndCurrentSteps.length - 1,
                                );
                            })}
                        </div>

                        {/* Flexible connector between groups */}
                        {upcomingSteps.length > 0 && (
                            <div className="bz-process-progress__flexible-connector" />
                        )}

                        {/* Right group: Upcoming steps */}
                        {upcomingSteps.length > 0 && (
                            <div className="bz-process-progress__right-group">
                                {upcomingSteps.map((step, index) => {
                                    const stepNumber = getStepNumber(step.key);
                                    return renderStep(
                                        step,
                                        stepNumber,
                                        index === upcomingSteps.length - 1,
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    /* Full mode: Sequential layout (original) */
                    visibleSteps.map((step, visibleIndex) => {
                        const stepNumber = visibleIndex + 1;
                        return (
                            <Fragment key={step.key}>
                                <div
                                    ref={
                                        step.key === currentStep
                                            ? currentStepRef
                                            : null
                                    }
                                    className={classNames(
                                        "bz-process-progress__step",
                                        {
                                            "bz-process-progress__step--clickable":
                                                !isOnSuccessStep &&
                                                step.key <= lastVisitedStep &&
                                                step.key !== currentStep,
                                        },
                                    )}
                                    onClick={
                                        !isOnSuccessStep &&
                                        step.key <= lastVisitedStep &&
                                        step.key !== currentStep
                                            ? () => handleStepClick(step)
                                            : undefined
                                    }
                                    role={
                                        !isOnSuccessStep &&
                                        step.key <= lastVisitedStep &&
                                        step.key !== currentStep
                                            ? "button"
                                            : undefined
                                    }
                                    style={
                                        !isOnSuccessStep &&
                                        step.key <= lastVisitedStep &&
                                        step.key !== currentStep
                                            ? { cursor: "pointer" }
                                            : undefined
                                    }
                                >
                                    <div
                                        className={classNames(
                                            "bz-process-progress__indicator",
                                            {
                                                "bz-process-progress__indicator--current":
                                                    step.key === currentStep,
                                                "bz-process-progress__indicator--upcoming":
                                                    step.key > currentStep &&
                                                    step.key > lastVisitedStep,
                                                "bz-process-progress__indicator--visited":
                                                    step.key > currentStep &&
                                                    step.key <= lastVisitedStep,
                                                "bz-process-progress__indicator--completed":
                                                    step.key < currentStep,
                                            },
                                        )}
                                    >
                                        {step.key < currentStep ? (
                                            <Icon
                                                icon={IconCheck}
                                                color="white"
                                                size="300"
                                            />
                                        ) : null}
                                    </div>

                                    <BlockStack
                                        gap="050"
                                        inlineAlign="start"
                                        className="bz-process-progress__text-container"
                                    >
                                        <Text
                                            variant="body-s"
                                            color="text-secondary"
                                        >
                                            {`Стъпка ${stepNumber}`}
                                        </Text>
                                        {step.label && (
                                            <Text
                                                variant="body-m"
                                                color={
                                                    step.key < currentStep
                                                        ? "blue-200"
                                                        : step.key ===
                                                            currentStep
                                                          ? "dark-500"
                                                          : "gray-500"
                                                }
                                            >
                                                <span
                                                    className="bz-process-progress__label-text"
                                                    title={step.label}
                                                >
                                                    {step.label}
                                                </span>
                                            </Text>
                                        )}
                                    </BlockStack>
                                </div>

                                {visibleIndex < visibleSteps.length - 1 && (
                                    <div
                                        className={classNames(
                                            "bz-process-progress__connector",
                                            {
                                                "bz-process-progress__connector--completed":
                                                    step.key < currentStep,
                                            },
                                        )}
                                    />
                                )}
                            </Fragment>
                        );
                    })
                )}
            </InlineStack>
        </Box>
    );
}

export default ProcessProgressBar;
