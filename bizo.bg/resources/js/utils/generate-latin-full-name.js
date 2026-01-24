export default function generateLatinFullName(firstName, lastName) {
    // Bulgarian Cyrillic to Latin transliteration map
    const cyrillicToLatin = {
        А: "A",
        а: "a",
        Б: "B",
        б: "b",
        В: "V",
        в: "v",
        Г: "G",
        г: "g",
        Д: "D",
        д: "d",
        Е: "E",
        е: "e",
        Ж: "Zh",
        ж: "zh",
        З: "Z",
        з: "z",
        И: "I",
        и: "i",
        Й: "Y",
        й: "y",
        К: "K",
        к: "k",
        Л: "L",
        л: "l",
        М: "M",
        м: "m",
        Н: "N",
        н: "n",
        О: "O",
        о: "o",
        П: "P",
        п: "p",
        Р: "R",
        р: "r",
        С: "S",
        с: "s",
        Т: "T",
        т: "t",
        У: "U",
        у: "u",
        Ф: "F",
        ф: "f",
        Х: "H",
        х: "h",
        Ц: "Ts",
        ц: "ts",
        Ч: "Ch",
        ч: "ch",
        Ш: "Sh",
        ш: "sh",
        Щ: "Sht",
        щ: "sht",
        Ъ: "A",
        ъ: "a",
        Ь: "Y",
        ь: "y",
        Ю: "Yu",
        ю: "yu",
        Я: "Ya",
        я: "ya",
    };

    const transliterate = (text) => {
        if (!text) return "";
        return text
            .split("")
            .map((char) => cyrillicToLatin[char] || char)
            .join("");
    };

    const latinFirstName = transliterate(firstName);
    const latinLastName = transliterate(lastName);

    return `${latinFirstName} ${latinLastName}`.toUpperCase();
}
