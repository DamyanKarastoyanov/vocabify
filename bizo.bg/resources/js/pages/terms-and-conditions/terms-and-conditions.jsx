/**
 * External dependencies
 */
import { Head } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Page from "@/components/page/page";
import IconTermsOfUse from "@/components/icons/terms-of-use";
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";

const TermsAndConditions = () => {
    return (
        <Page>
            <Head title="Общи условия" />
            <BlockStack gap="800">
                <InlineStack gap="800" blockAlign="center">
                    <Icon icon={IconTermsOfUse} size="2000" />
                    <Text variant="heading-xl">
                        Общи условия за ползване на сайта www.bizo.bg
                    </Text>
                </InlineStack>

                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            {/* I. ОБЩИ ПОЛОЖЕНИЯ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    I. Общи положения
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Настоящите Общи условия уреждат
                                        условията и реда за ползване на интернет
                                        сайта www.bizo.bg („Сайтът"), който
                                        представлява електронна платформа за
                                        технико-организационно обезпечаване на
                                        предоставянето на
                                        застрахователно-посреднически услуги от
                                        разстояние.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Сайтът е собственост на „БИЗО.БГ"
                                        ООД, ЕИК 208581374, със седалище и адрес
                                        на управление: гр. Варна, р-н Приморски,
                                        ул. „Кап. Георги Боев" № 4, ет. 5, ап.
                                        47 („Оператор на платформата").
                                    </Text>
                                    <Text variant="body-m">
                                        3. Чрез Сайта
                                        застрахователно-посреднически услуги от
                                        разстояние предоставя „ДЕЛТА ПРИМА
                                        БРОКЕР" ЕООД, ЕИК 208370822, със
                                        седалище и адрес на управление: гр.
                                        София 1618, район „Витоша", бул.
                                        „Александър Пушкин" № 5, ет. 1
                                        („Брокерът"), лицензиран застрахователен
                                        брокер, вписан в регистъра на Комисията
                                        за финансов надзор.
                                    </Text>
                                    <Text variant="body-m">
                                        4. „БИЗО.БГ" ООД не е застрахователен
                                        посредник и не предоставя
                                        застрахователни услуги, а осигурява
                                        единствено технологичната платформа за
                                        тяхното извършване от Брокера.
                                    </Text>
                                    <Text variant="body-m">
                                        5. С използването на Сайта Потребителят
                                        декларира, че е запознат с настоящите
                                        Общи условия, приема ги изцяло и се
                                        задължава да ги спазва.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* II. ДЕФИНИЦИИ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">II. Дефиниции</Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. „Потребител" / „Клиент" – всяко
                                        физическо или юридическо лице, което
                                        използва Сайта с цел получаване на
                                        информация или сключване на
                                        застрахователен договор от разстояние.
                                    </Text>
                                    <Text variant="body-m">
                                        2. „Договор за застрахователни услуги от
                                        разстояние" – договор, сключен между
                                        Потребителя и Брокера при условията на
                                        Закона за предоставяне на финансови
                                        услуги от разстояние (ЗПФУР), чрез
                                        използване на Сайта.
                                    </Text>
                                    <Text variant="body-m">
                                        3. „Застраховател" – застрахователно
                                        дружество, лицензирано съгласно
                                        българското законодателство, чиито
                                        продукти се предлагат чрез Брокера.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* III. СЪЩНОСТ НА УСЛУГАТА */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    III. Същност на услугата
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Сайтът предоставя възможност на
                                        Потребителите:
                                    </Text>
                                    <Box paddingInlineStart="400">
                                        <BlockStack gap="200">
                                            <Text variant="body-m">
                                                - да получават информация за
                                                застрахователни продукти;
                                            </Text>
                                            <Text variant="body-m">
                                                - да заявяват сключване на
                                                застрахователни договори от
                                                разстояние;
                                            </Text>
                                            <Text variant="body-m">
                                                - да заплащат застрахователни
                                                премии;
                                            </Text>
                                            <Text variant="body-m">
                                                - да получават документи и
                                                известия, свързани със
                                                застрахователните договори.
                                            </Text>
                                        </BlockStack>
                                    </Box>
                                    <Text variant="body-m">
                                        2. Всички застрахователни договори се
                                        сключват директно между Потребителя и
                                        съответния Застраховател, чрез
                                        посредничеството на Брокера.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* IV. СКЛЮЧВАНЕ НА ДОГОВОР ОТ РАЗСТОЯНИЕ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    IV. Сключване на договор от разстояние
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Чрез подаване на онлайн заявка през
                                        Сайта Потребителят отправя предложение
                                        до Брокера за сключване на договор за
                                        застрахователни услуги от разстояние.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Договорът се счита за сключен от
                                        момента на изричното потвърждение от
                                        страна на Брокера и/или Застрахователя,
                                        съгласно приложимото законодателство.
                                    </Text>
                                    <Text variant="body-m">
                                        3. Преди сключването на договора
                                        Потребителят получава цялата изискуема
                                        по закон преддоговорна информация.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* V. ЦЕНИ И ПЛАЩАНИЯ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    V. Цени и плащания
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Цената на застрахователните услуги е
                                        застрахователната премия, определена от
                                        съответния Застраховател.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Плащането на застрахователните премии
                                        чрез Сайта се извършва по следния начин:
                                    </Text>
                                    <Box paddingInlineStart="400">
                                        <BlockStack gap="200">
                                            <Text variant="body-m">
                                                <strong>2.1.</strong> Плащане с
                                                дебитна/кредитна карта
                                                посредством виртуален ПОС
                                                терминал (V-POS).
                                            </Text>
                                            <Text variant="body-m">
                                                <strong>2.2.</strong> Приемат се
                                                следните видове карти: дебитни,
                                                кредитни и бизнес карти Visa,
                                                Mastercard и bCard.
                                            </Text>
                                            <Text variant="body-m">
                                                <strong>2.3.</strong> Картовите
                                                транзакции се осъществяват
                                                посредством програмите за
                                                сигурност MasterCard Identity
                                                Check и VISA Secure.
                                            </Text>
                                            <Text variant="body-m">
                                                <strong>2.4.</strong> „БИЗО.БГ"
                                                ООД и Брокерът не съхраняват
                                                данни за банковите карти,
                                                използвани за плащане чрез
                                                Сайта.
                                            </Text>
                                            <Text variant="body-m">
                                                <strong>2.5.</strong> При
                                                необходимост от възстановяване
                                                на сума, платена с банкова
                                                карта, същата се възстановява по
                                                същата карта, с която е
                                                извършено плащането.
                                            </Text>
                                        </BlockStack>
                                    </Box>
                                    <Text variant="body-m">
                                        3. Обработката на картовите плащания се
                                        извършва от лицензирана банка –
                                        доставчик на платежни услуги.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* VI. ОТГОВОРНОСТИ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    VI. Отговорности
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. „БИЗО.БГ" ООД не носи отговорност за
                                        съдържанието на застрахователните
                                        договори, за изпълнението им и за
                                        отношенията между Потребителя, Брокера и
                                        Застрахователя.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Операторът на платформата не отговаря
                                        за вреди, причинени от временно
                                        прекъсване на достъпа до Сайта поради
                                        технически причини.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* VII. ЗАЩИТА НА ЛИЧНИТЕ ДАННИ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    VII. Защита на личните данни
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. „БИЗО.БГ" ООД обработва лични данни в
                                        качеството си на администратор на лични
                                        данни в съответствие с Регламент (ЕС)
                                        2016/679 (GDPR) и Закона за защита на
                                        личните данни.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Подробна информация относно
                                        обработването на личните данни се
                                        съдържа в Уведомлението за
                                        поверителност, публикувано на Сайта.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* VIII. БИСКВИТКИ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">VIII. Бисквитки</Text>
                                <Text variant="body-m">
                                    Сайтът използва „бисквитки" съгласно
                                    Политиката за използване на бисквитки,
                                    публикувана на www.bizo.bg.
                                </Text>
                            </BlockStack>

                            {/* IX. ЖАЛБИ И СПОРОВЕ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    IX. Жалби и спорове
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Жалби, свързани със
                                        застрахователно-посредническите услуги,
                                        се подават до „ДЕЛТА ПРИМА БРОКЕР" ЕООД
                                        на посочените в Сайта координати.
                                    </Text>
                                    <Text variant="body-m">
                                        2. Потребителите имат право да отнесат
                                        спора до Комисията за финансов надзор,
                                        Комисията за защита на потребителите или
                                        до съответната секторна помирителна
                                        комисия.
                                    </Text>
                                </BlockStack>
                            </BlockStack>

                            {/* X. ЗАКЛЮЧИТЕЛНИ РАЗПОРЕДБИ */}
                            <BlockStack gap="400">
                                <Text variant="heading-m">
                                    X. Заключителни разпоредби
                                </Text>
                                <BlockStack gap="300">
                                    <Text variant="body-m">
                                        1. Настоящите Общи условия могат да
                                        бъдат изменяни едностранно, като
                                        актуалната версия се публикува на Сайта.
                                    </Text>
                                    <Text variant="body-m">
                                        2. За неуредените въпроси се прилага
                                        българското законодателство.
                                    </Text>
                                    <Text variant="body-m">
                                        3. Всички спорове се решават от
                                        компетентния български съд.
                                    </Text>
                                    <Text variant="body-m">
                                        Настоящите Общи условия са приети и
                                        влизат в сила от датата на публикуването
                                        им на сайта www.bizo.bg.
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(TermsAndConditions);
