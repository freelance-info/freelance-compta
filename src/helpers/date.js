export function parseDate(dateString) {
    if (dateString.length < 10) {
        return null;
    }
    try {
        const values = dateString.split('/');
        if (values.length !== 3) {
            return new Date(dateString);
        } else {
            const result = new Date('1970-01-01');
            result.setFullYear(values[2], values[1] - 1, values[0]);
            return result;
        }
    } catch (error) {
        return null;
    }
}