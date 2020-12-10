import { scrollTo } from './scroll';
import { parseDate } from './date';

export const searchLines = (lines, searchText, searchColId, searchResults) => {
  let newSearchResults;
  let regexp = null;
  if (searchColId.toLowerCase() === 'date') {
    const normalizedDate = parseDate(searchText);
    if (normalizedDate) {
      const dateString = normalizedDate.toISOString().substr(0, 10);
      regexp = new RegExp(dateString);
    } else {
      throw new Error('Bad date format');
    }
  } else {
    regexp = new RegExp(searchText, 'gi');
  }
  if (searchResults.length === 0) {
    newSearchResults = [];
    lines.forEach((line, index) => {
      if (line[searchColId] && `${line[searchColId]}`.search(regexp) >= 0) {
        newSearchResults.push(index);
      }
    });
  } else {
    newSearchResults = [...searchResults];
  }
  document.querySelectorAll('input').forEach(input => { input.style.backgroundColor = 'transparent'; });
  if (newSearchResults.length > 0) {
    const lineIndex = newSearchResults.shift();
    const cellId = `#body-cell-${lineIndex}-${searchColId}`;
    scrollTo('#ledger-scrollable-container', cellId);
    document.querySelector(cellId).querySelector('input').style.backgroundColor = 'yellow';
  }
  return newSearchResults;
};
