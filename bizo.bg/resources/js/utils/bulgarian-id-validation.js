/**
 * Canonical internal type keys
 */
const ID_TYPES = {
    EGN: "EGN",
    LNC: "LNC",
    EIK: "EIK",
    VAT: "VAT",
};

/**
 * Validates ЕГН (EGN) - 10 digits with check digit validation
 * @param {string} egn - The EGN to validate
 * @returns {boolean} - True if valid
 */
export function validateEGN(egn) {
    egn = String(egn).trim();

    // Must be exactly 10 digits
    if (!/^\d{10}$/.test(egn)) return false;

    const d = egn.split("").map(Number);

    // ---- Date validation (with century-encoded month) ----
    let year = d[0] * 10 + d[1];
    let month = d[2] * 10 + d[3];
    const day = d[4] * 10 + d[5];

    let fullYear;
    if (month >= 1 && month <= 12) {
        fullYear = 1900 + year;
    } else if (month >= 21 && month <= 32) {
        fullYear = 1800 + year;
        month -= 20;
    } else if (month >= 41 && month <= 52) {
        fullYear = 2000 + year;
        month -= 40;
    } else {
        return false; // impossible month encoding
    }

    // Validate real calendar date
    const date = new Date(fullYear, month - 1, day);
    if (
        date.getFullYear() !== fullYear ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return false;
    }

    // ---- Checksum validation ----
    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += d[i] * weights[i];

    const remainder = sum % 11;
    const checkDigit = remainder === 10 ? 0 : remainder;

    return d[9] === checkDigit;
}

/**
 * Validates ЛНЧ (LNC) - 10 digits, no check digit
 * @param {string} lnc - The LNC to validate
 * @returns {boolean} - True if valid
 */
export function validateLNC(lnc) {
    if (!lnc || typeof lnc !== "string") return false;

    // Must be exactly 10 digits
    return /^[0-9]{10}$/.test(lnc);
}

/**
 * Validates ЕИК (EIK/Bulstat) - 9 or 13 digits with check digit validation
 * @param {string} eik - The EIK to validate
 * @returns {boolean} - True if valid
 */
export function validateEIK(eik) {
    if (!eik || typeof eik !== "string") return false;

    // Must be exactly 9 or 13 digits (explicit length check)
    if (eik.length !== 9 && eik.length !== 13) return false;

    // Must contain only digits
    if (!/^[0-9]+$/.test(eik)) return false;

    const digits = eik.split("").map(Number);

    // For 9-digit EIK
    if (digits.length === 9) {
        const weights = [1, 2, 3, 4, 5, 6, 7, 8];
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += digits[i] * weights[i];
        }
        const remainder = sum % 11;
        const checkDigit = remainder < 10 ? remainder : 0;
        return digits[8] === checkDigit;
    }

    // For 13-digit EIK
    if (digits.length === 13) {
        // First 9 digits validation
        const weights9 = [1, 2, 3, 4, 5, 6, 7, 8];
        let sum9 = 0;
        for (let i = 0; i < 8; i++) {
            sum9 += digits[i] * weights9[i];
        }
        const remainder9 = sum9 % 11;
        const checkDigit9 = remainder9 < 10 ? remainder9 : 0;
        if (digits[8] !== checkDigit9) return false;

        // Last 4 digits validation (positions 9-12, check digit at 13)
        const weights13 = [2, 7, 3, 5];
        let sum13 = 0;
        for (let i = 0; i < 4; i++) {
            sum13 += digits[9 + i] * weights13[i];
        }
        const remainder13 = sum13 % 11;
        const checkDigit13 = remainder13 < 10 ? remainder13 : 0;
        return digits[12] === checkDigit13;
    }

    return false;
}

/**
 * Validates НДС (VAT/Identity document number) - 3-20 characters, letters/digits/-/
 * @param {string} vat - The VAT/Identity document number to validate
 * @returns {boolean} - True if valid
 */
export function validateVAT(vat) {
    if (!vat || typeof vat !== "string") return false;

    // Must be 3-20 characters, start and end with alphanumeric, can contain -/ in between
    return /^[A-Za-z0-9][A-Za-z0-9\-\/]{1,18}[A-Za-z0-9]$/.test(vat);
}

/**
 * Normalize input type into { value, label }
 */
function normalizeTypeInput(type) {
    if (type && typeof type === "object" && type.value !== undefined) {
        return {
            value: type.value,
            label: type.label ?? null,
        };
    }
    return { value: type, label: null };
}

/**
 * Checks if a label contains a type identifier as a whole word
 * (your original function, unchanged)
 */
function labelContainsType(label, identifiers) {
    const labelUpper = String(label).toUpperCase().trim();
    const idArray = Array.isArray(identifiers) ? identifiers : [identifiers];

    for (const id of idArray) {
        const idUpper = id.toUpperCase();

        if (labelUpper === idUpper) return true;

        const escapedId = idUpper.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const startPattern = new RegExp(
            `^${escapedId}([^A-Za-z0-9А-Яа-я]|$)`,
            "i",
        );
        const endPattern = new RegExp(
            `([^A-Za-z0-9А-Яа-я]|^)${escapedId}$`,
            "i",
        );
        const middlePattern = new RegExp(
            `[^A-Za-z0-9А-Яа-я]${escapedId}[^A-Za-z0-9А-Яа-я]`,
            "i",
        );

        if (
            startPattern.test(labelUpper) ||
            endPattern.test(labelUpper) ||
            middlePattern.test(labelUpper)
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Resolve canonical type from label/value using ONE flow.
 * Returns one of: "EGN" | "LNC" | "EIK" | "VAT" | null
 */
function resolveIdentificationType(typeInput) {
    const { value, label } = normalizeTypeInput(typeInput);

    // 1) Label-based (strongest, if provided)
    if (label != null) {
        const labelUpper = String(label).toUpperCase().trim();

        // Exact label matches
        if (
            labelUpper === "ЕИК" ||
            labelUpper === "EIK" ||
            labelUpper === "БУЛСТАТ" ||
            labelUpper === "BULSTAT"
        ) {
            return ID_TYPES.EIK;
        }
        if (labelUpper === "ЕГН" || labelUpper === "EGN") return ID_TYPES.EGN;
        if (labelUpper === "ЛНЧ" || labelUpper === "LNC") return ID_TYPES.LNC;
        if (labelUpper === "НДС" || labelUpper === "VAT") return ID_TYPES.VAT;

        // Whole-word matches
        if (labelContainsType(label, ["ЕИК", "EIK", "БУЛСТАТ", "BULSTAT"]))
            return ID_TYPES.EIK;
        if (labelContainsType(label, ["ЕГН", "EGN"])) return ID_TYPES.EGN;
        if (labelContainsType(label, ["ЛНЧ", "LNC"])) return ID_TYPES.LNC;
        if (labelContainsType(label, ["НДС", "VAT"])) return ID_TYPES.VAT;
    }

    // 2) Value/code-based fallback
    const typeStr = String(value);
    const typeNum = Number(value);

    // Your mapping:
    // 1 -> EGN
    // 2/3 -> LNC
    // 4 -> VAT
    // 5 -> EIK
    if (typeStr === "1" || typeNum === 1) return ID_TYPES.EGN;
    if (typeStr === "2" || typeNum === 2 || typeStr === "3" || typeNum === 3)
        return ID_TYPES.LNC;
    if (typeStr === "4" || typeNum === 4) return ID_TYPES.VAT;
    if (typeStr === "5" || typeNum === 5) return ID_TYPES.EIK;

    return null;
}

/**
 * Registry: validators, regexes, and messages.
 * Single source of truth.
 */
const ID_REGISTRY = {
    [ID_TYPES.EGN]: {
        validate: validateEGN,
        regex: /^\d{10}$/,
        message: "ЕГН трябва да е точно 10 цифри с валидна контролна цифра",
    },
    [ID_TYPES.LNC]: {
        validate: validateLNC,
        regex: /^\d{10}$/,
        message: "ЛНЧ трябва да е точно 10 цифри",
    },
    [ID_TYPES.EIK]: {
        validate: validateEIK,
        regex: /^\d{9}$|^\d{13}$/,
        message: "ЕИК трябва да е 9 или 13 цифри с валидна контролна цифра",
    },
    [ID_TYPES.VAT]: {
        validate: validateVAT,
        regex: /^[A-Za-z0-9][A-Za-z0-9\-\/]{1,18}[A-Za-z0-9]$/,
        message: "НДС трябва да е между 3 и 20 символа (букви, цифри, - или /)",
    },
};

/**
 * Validates identification number based on its resolved type.
 */
export function validateIdentificationNumber(value, type) {
    if (value == null) return false;

    const resolved = resolveIdentificationType(type);
    if (!resolved) return false;

    // Normalize value once here (let individual validators do their own trim if they want)
    const val = String(value).trim();
    if (val.length === 0) return false;

    return ID_REGISTRY[resolved].validate(val);
}

/**
 * Returns regex for UI input masking/validation based on resolved type
 */
export function getIdentificationNumberRegex(type) {
    const resolved = resolveIdentificationType(type);
    return resolved ? ID_REGISTRY[resolved].regex : null;
}

/**
 * Returns error message based on resolved type
 */
export function getIdentificationNumberErrorMessage(type) {
    const resolved = resolveIdentificationType(type);
    return resolved
        ? ID_REGISTRY[resolved].message
        : "Невалиден идентификационен номер";
}
