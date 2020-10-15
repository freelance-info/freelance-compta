// Sort lines by given column
export function sortByCol(lines, col) {
  if (lines) {
    lines.sort((l1, l2) => {
      if (l1[col] === l2[col]) {
        return 0;
      }
      return l1[col] < l2[col] ? -1 : 1;
    });
  }
  return lines;
}
