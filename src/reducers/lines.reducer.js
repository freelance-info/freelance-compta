import { PARAMETER_DEFAULT_CASHING, PARAMETER_DEFAULT_TVA, PARAMETER_DEFAULT_DEBIT_ACCOUNT, PARAMETER_DEFAULT_CREDIT_ACCOUNT, PARAMETER_KEYS } from './globals';
import { sortByCol } from './sort';

export const linesInitialState = {
  cols: [
    { id: 'date', title: 'Date', type: 'Date', required: true },
    { id: 'ref', title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
    { id: 'client', title: 'Client', type: 'Text', required: false, width: '150px' },
    { id: 'debit', title: "Compte débité", type: 'Select', required: true, width: '100px', defaultParamKey: PARAMETER_DEFAULT_DEBIT_ACCOUNT },
    { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '200px' },
    { id: 'ht', title: 'Montant HT', type: 'Number', required: false, width: '100px' },
    { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
    { id: 'tva', title: 'TVA', type: 'Select', required: false, width: '75px', defaultParamKey: PARAMETER_DEFAULT_TVA },
    { id: 'mode', title: "Mode d'encaissement", type: 'Select', required: false, width: '100px', defaultParamKey: PARAMETER_DEFAULT_CASHING },
    { id: 'credit', title: 'Compte crédité', type: 'Text', required: true, width: '100px', defaultParamKey: PARAMETER_DEFAULT_CREDIT_ACCOUNT },
  ],
  lines: [],
  selectedLines: [],
  highlightedLines: [],
};

export const linesReducer = ({ lines, selectedLines, highlightedLines, cols }, action) => {
  // By default copy initial state
  const newCols = [...cols];
  let newSelectedLines = [...selectedLines];
  let newLines = [...lines];
  let newHighlightedLines = [...highlightedLines];

  switch (action.type) {
    case 'initCols':
      // Set default values from parameters
      newCols.forEach(newCol => {
        if (newCol.defaultParamKey) {
          newCol.defaultValue = action.parameters.get(newCol.defaultParamKey);
          newCol.options = PARAMETER_KEYS.get(newCol.defaultParamKey);
        }
      });
      break;
    case 'initLines':
      newLines = [...action.initLines];
      sortByCol(newLines, 'date');
      newHighlightedLines = [];
      newSelectedLines = [];
      break;
    case 'lineChange':
      newLines[action.lineNumber][action.col.id] = action.val;
      if (action.col.id === 'ht') {
        const tva = newLines[action.lineNumber].tva / 100;
        newLines[action.lineNumber].ttc = Math.round(action.val * (1 + tva) * 100) / 100;
      }
      break;
    case 'addLine':
      newLines.push({});
      cols.forEach(col => { newLines[newLines.length - 1][col.id] = col.defaultValue; });
      newHighlightedLines.push(newLines.length - 1);
      newSelectedLines = [];
      break;
    case 'select':
      if (action.checked) {
        newSelectedLines.push(action.lineNumber);
      } else {
        const idx = newSelectedLines.findIndex(selectedLine => selectedLine === action.lineNumber);
        newSelectedLines.splice(idx, 1);
      }
      break;
    case 'selectAll':
      newSelectedLines = lines.map((_line, index) => index);
      break;
    case 'unselectAll':
      newSelectedLines = [];
      break;
    case 'removeSelected':
      newLines = [];
      lines.forEach((line, index) => {
        if (!selectedLines.some(idx => index === idx)) {
          newLines.push(line);
        }
      });
      newSelectedLines = [];
      newHighlightedLines = [];
      break;
    case 'duplicateSelected':
      lines.forEach((line, index) => {
        if (selectedLines.some(idx => index === idx)) {
          const newLine = { ...line };
          newLines.push(newLine);
          newHighlightedLines.push(newLines.length - 1);
        }
      });
      newSelectedLines = [];
      break;
    case 'sortLines':
      sortByCol(newLines, action.clickedColumn, action.direction);
      break;
    default:
      throw new Error();
  }
  return { cols: newCols, lines: newLines, selectedLines: newSelectedLines, highlightedLines: newHighlightedLines };
};
