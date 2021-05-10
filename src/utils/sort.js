// Sort lines by given column
export function sortByCol(lines, col, direction) {
  if (lines) {
    lines.sort((l1, l2) => {
      if (l1[col] === l2[col]) {
        return 0;
      }
      if (direction && direction === 'descending') {
        return l1[col] < l2[col] ? 1 : -1;
      }
      return l1[col] < l2[col] ? -1 : 1;
    });
  }
  return lines;
}
