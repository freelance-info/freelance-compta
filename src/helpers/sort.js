// Sort lines by given column
export function sortByCol(lines, col) {
    if (lines) {
        lines.sort((l1, l2) => l1[col] < l2[col] ? -1 : l1[col] === l2[col] ? 0 : 1);
    }
    return lines;
}
