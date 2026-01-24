const parseDate = (value) => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value;
    if (typeof value === "string") {
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null;
    }
    if (typeof value === "number") {
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null;
    }
    return null;
};

export default parseDate;
