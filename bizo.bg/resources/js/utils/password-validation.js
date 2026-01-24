export const PASSWORD_VALIDATION = {
    LOWERCASE_REGEX: /(?=.*[a-z])/,
    LOWERCASE_MESSAGE: "Паролата трябва да съдържа поне 1 малка буква",

    UPPERCASE_REGEX: /(?=.*[A-Z])/,
    UPPERCASE_MESSAGE: "Паролата трябва да съдържа поне 1 голяма буква",

    DIGIT_REGEX: /(?=.*\d)/,
    DIGIT_MESSAGE: "Паролата трябва да съдържа поне 1 цифра",

    SPECIAL_CHAR_REGEX: /(?=.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`\\])/,
    SPECIAL_CHAR_MESSAGE: "Паролата трябва да съдържа поне 1 специален символ",
};
