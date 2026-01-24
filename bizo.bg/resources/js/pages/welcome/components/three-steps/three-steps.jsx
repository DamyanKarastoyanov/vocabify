/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import IconStepPersonal from "@/components/icons/step-personal";
import IconStepPayment from "@/components/icons/step-payment";
import IconStepMail from "@/components/icons/step-mail";
import Divider from "@/components/divider/divider";
import DividerOrientationEnum from "@/components/divider/divider-orientation-enum";
import IconSurface from "@/components/icon-surface/icon-surface";
import Icon from "@/components/icon/icon";

const steps = [
    {
        id: 1,
        title: "Попълваш личните си данни",
        icon: IconStepPersonal,
    },
    {
        id: 2,
        title: "Плащаш онлайн или по банка",
        icon: IconStepPayment,
    },
    {
        id: 3,
        title: "Получаваш полица по имейл",
        icon: IconStepMail,
    },
];

const ThreeSteps = () => {
    return (
        <section className="bz-three-steps">
            <div className="bz-three-steps__container">
                <div className="bz-three-steps__header">
                    <Text className="bz-three-steps__number">3</Text>

                    <Text variant="heading-l" color="white">
                        прости
                        <br />
                        стъпки
                    </Text>
                </div>

                <Divider
                    orientation={DividerOrientationEnum.VERTICAL}
                    color="brand-500"
                />

                {/* Mobile horizontal divider */}
                <div className="bz-three-steps__mobile-divider" />

                <div className="bz-three-steps__list">
                    {steps.map((step) => (
                        <div key={step.id} className="bz-three-steps__step">
                            <IconSurface color="white">
                                <Icon icon={step.icon} size="1000" />
                            </IconSurface>

                            <Text variant="body-l" color="white">
                                {step.title}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThreeSteps;
