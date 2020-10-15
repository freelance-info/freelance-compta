export function computeTotals(lines, cols) {
  const result = new Map();
  const numberCols = cols.filter(col => col.type === 'Number');
  numberCols.forEach(col => {
    result.set(col.id, lines.reduce((total, line) => (line[col.id] ? total + (1 * line[col.id]) : total), 0));
  });
  return result;
}
