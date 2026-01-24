/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import FormControl from "@/components/form-control/form-control";
import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/text-input/text-input";
import InlineStack from "@/components/inline-stack/inline-stack";
import Box from "@/components/box/box";
import IconButton from "@/components/icon-button/icon-button";
import IconRefresh from "@/components/icons/refresh";
import Spinner from "@/components/spinner/spinner";
import InlineError from "@/components/inline-error/inline-error";

const VehicleInspectionCaptcha = (props) => {
    const {
        register,
        captchaData,
        onRefreshClick,
        isRefreshing,
        fieldErrorText,
    } = props;

    return (
        <FormControl>
            <FormLabel htmlFor="captcha_code" required>
                Код за сигурност
            </FormLabel>

            <BlockStack gap="200">
                <Box>
                    <InlineStack blockAlign="center" gap="200">
                        <Box className="bz-vehicle-inspection-captcha-image">
                            {isRefreshing || !captchaData ? (
                                <Spinner size="600" />
                            ) : (
                                <img
                                    src={`data:image/png;base64,${captchaData.captcha_image}`}
                                    alt="Код за сигурност"
                                />
                            )}
                        </Box>

                        {!isRefreshing && captchaData && (
                            <IconButton
                                icon={IconRefresh}
                                variant="secondary"
                                size="600"
                                onClick={onRefreshClick}
                            />
                        )}
                    </InlineStack>
                </Box>

                <TextInput
                    id="captcha_code"
                    {...register}
                    placeholder="Въведете кода от изображението"
                    autoComplete="off"
                    invalid={!!fieldErrorText}
                />
                {fieldErrorText && (
                    <>
                        <InlineError>{fieldErrorText}</InlineError>
                    </>
                )}
            </BlockStack>
        </FormControl>
    );
};

export default VehicleInspectionCaptcha;
