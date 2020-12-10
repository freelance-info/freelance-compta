export function parseDate(dateString) {
  if (dateString.length < 10) {
    return null;
  }
  try {
    const values = dateString.split('/');
    if (values.length !== 3) {
      return new Date(dateString);
    }
    const result = new Date(`${values[2]}-${values[0]}-${values[1]}`);
    return result;
  } catch (error) {
    return null;
  }
}
