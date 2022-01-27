import { UNIQUE_KEY_COL_ID } from './globals';

export const computeTotals = (lines, cols) => {
  const result = new Map();
  const numberCols = cols.filter(col => col.type === 'Number');
  numberCols.forEach(col => {
    result.set(col.id, lines.reduce((total, line) => (line[col.id] ? total + (1 * line[col.id]) : total), 0));
  });
  return result;
};

const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
  // eslint-disable-next-line no-bitwise, no-mixed-operators
  c => c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);

// Add unique ID to compute React "key" property
export const addLineId = line => {
  const result = { ...line };
  result[UNIQUE_KEY_COL_ID] = uuidv4();
  return result;
};

export const addLinesId = lines => lines.map(line => addLineId(line));

export const computeRowCellId = (lineNumber, colId) => `row-cell-${lineNumber}-${colId}`;
