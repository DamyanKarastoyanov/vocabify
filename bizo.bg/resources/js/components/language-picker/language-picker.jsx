/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconBgFlag from "@/components/icons/bg-flag";
import IconEnFlag from "@/components/icons/en-flag";
import IconCaretDown from "@/components/icons/caret-down";

const LANGUAGES = [
    {
        code: "bg",
        name: "Български",
        flag: IconBgFlag,
    },
    {
        code: "en",
        name: "English",
        flag: IconEnFlag,
    },
];

const LanguagePicker = ({ currentLanguage = "bg" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang =
        LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

    const handleLanguageChange = (languageCode) => {
        setIsOpen(false);
        // TODO: Implement language change logic
        console.log("Switching to language:", languageCode);
        // router.visit(route('switch-language', { lang: languageCode }));
    };

    return (
        <div
            className="bz-language-picker"
            ref={dropdownRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="bz-language-picker__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <div className="bz-language-picker__flag">
                        <Icon icon={currentLang.flag} size="600" />
                    </div>
                    <div className="bz-language-picker__arrow">
                        <Icon icon={IconCaretDown} size="400" />
                    </div>
                </InlineStack>
            </button>

            {isOpen && (
                <div className="bz-language-picker__dropdown">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`bz-language-picker__option ${
                                lang.code === currentLanguage
                                    ? "bz-language-picker__option--active"
                                    : ""
                            }`}
                            onClick={() => handleLanguageChange(lang.code)}
                            type="button"
                        >
                            <InlineStack
                                gap="300"
                                blockAlign="center"
                                wrap={false}
                            >
                                <div className="bz-language-picker__flag">
                                    <Icon icon={lang.flag} size="600" />
                                </div>
                                <span className="bz-language-picker__name">
                                    {lang.name}
                                </span>
                            </InlineStack>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguagePicker;
