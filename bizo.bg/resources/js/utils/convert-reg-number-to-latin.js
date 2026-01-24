export default function convertRegNumberToLatin(regNumber) {
    const cyrillicToLatin = {
        А: "A",
        В: "B",
        Е: "E",
        К: "K",
        М: "M",
        Н: "H",
        О: "O",
        Р: "P",
        С: "C",
        Т: "T",
        У: "Y",
        Х: "X",
    };

    const transliterate = (text) => {
        if (!text) return "";
        return String(text)
            .toUpperCase()
            .split("")
            .map((char) => cyrillicToLatin[char] || char)
            .join("");
    };

    return transliterate(regNumber);
}
