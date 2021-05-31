import {
  PARAMETER_DEFAULT_CASHING, PARAMETER_DEFAULT_VAT, PARAMETER_DEFAULT_DEBIT_ACCOUNT, PARAMETER_DEFAULT_CREDIT_ACCOUNT,
  PARAMETER_KEYS, UNIQUE_KEY_COL_ID, PARAMETER_DEFAULT_CREDIT_TYPE, VAT_TYPE_COL_ID, DATE_COL_ID, VAT_RATE_COL_ID,
} from '../utils/globals';
import { sortByCol } from '../utils/sort';

export const linesInitialState = {
  cols: [
    { id: DATE_COL_ID, title: 'Date', type: 'Date', required: true },
    { id: UNIQUE_KEY_COL_ID, title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
    { id: 'client', title: 'Client', type: 'Text', required: false, width: '150px' },
    // eslint-disable-next-line max-len
    { id: 'debit', title: 'Compte débité', type: 'Select', required: true, width: '100px', defaultParamKey: PARAMETER_DEFAULT_DEBIT_ACCOUNT },
    { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '200px' },
    { id: VAT_TYPE_COL_ID, title: 'Type TVA', type: 'Select', required: true, width: '100px', defaultParamKey: PARAMETER_DEFAULT_CREDIT_TYPE },
    { id: 'ht', title: 'Montant HT', type: 'Number', required: false, width: '100px' },
    { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
    { id: VAT_RATE_COL_ID, title: 'TVA', type: 'Select', required: false, width: '75px', defaultParamKey: PARAMETER_DEFAULT_VAT },
    // eslint-disable-next-line max-len
    { id: 'mode', title: "Mode d'encaissement", type: 'Select', required: false, width: '100px', defaultParamKey: PARAMETER_DEFAULT_CASHING },
    // eslint-disable-next-line max-len
    { id: 'credit', title: 'Compte crédité', type: 'Text', required: true, width: '100px', defaultParamKey: PARAMETER_DEFAULT_CREDIT_ACCOUNT },
  ],
  lines: [],
  selectedLines: [],
  highlightedLines: [],
  unsaved: false,
};

export const linesReducer = ({
  lines, selectedLines, highlightedLines, cols, unsaved,
}, action) => {
  // console.log(`linesReducer: ${JSON.stringify(action)}`);
  // By default copy initial state
  const newCols = [...cols];
  let newSelectedLines = [...selectedLines];
  let newLines = [...lines];
  let newHighlightedLines = [...highlightedLines];
  let newUnsaved = unsaved;

  switch (action.type) {
    case 'initCols':
      // Set default values from parameters
      // eslint-disable-next-line no-restricted-syntax
      for (const newCol of newCols) {
        if (newCol.defaultParamKey) {
          newCol.defaultValue = action.parameters.get(newCol.defaultParamKey);
          newCol.options = PARAMETER_KEYS.get(newCol.defaultParamKey);
        }
      }
      break;
    case 'initLines':
      newLines = [...action.initLines];
      sortByCol(newLines, DATE_COL_ID);
      newHighlightedLines = [];
      newSelectedLines = [];
      break;
    case 'lineChange':
      newLines[action.lineNumber][action.col.id] = action.val;
      if (action.col.id === 'ht') {
        const vat = newLines[action.lineNumber].tva / 100;
        newLines[action.lineNumber].ttc = Math.round(action.val * (1 + vat) * 100) / 100;
      }
      newUnsaved = true;
      break;
    case 'addLine':
      newLines.push({});
      cols.forEach(col => { newLines[newLines.length - 1][col.id] = col.defaultValue; });
      newHighlightedLines.push(newLines.length - 1);
      newSelectedLines = [];
      newUnsaved = true;
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
      newUnsaved = true;
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
      newUnsaved = true;
      break;
    case 'sortLines':
      sortByCol(newLines, action.clickedColumn, action.direction);
      break;
    case 'unsaved':
      newUnsaved = true;
      break;
    case 'saved':
      newUnsaved = false;
      break;
    default:
      throw new Error();
  }
  return {
    cols: newCols,
    lines: newLines,
    selectedLines: newSelectedLines,
    highlightedLines: newHighlightedLines,
    unsaved: newUnsaved,
  };
};
