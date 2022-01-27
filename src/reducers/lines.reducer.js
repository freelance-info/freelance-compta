import {
  PARAMETER_DEFAULT_CASHING,
  PARAMETER_DEFAULT_VAT,
  PARAMETER_DEFAULT_DEBIT_ACCOUNT,
  PARAMETER_DEFAULT_CREDIT_ACCOUNT,
  PARAMETER_DEFAULT_CREDIT_TYPE,
  PARAMETER_KEYS,
  INVOICE_NUMBER_COL_ID,
  VAT_TYPE_COL_ID, DATE_COL_ID,
  VAT_RATE_COL_ID,
  AMOUNT_EXCLUDING_TAX_COL_ID,
  AMOUNT_INCLUDING_TAX_COL_ID,
  UNIQUE_KEY_COL_ID,
} from '../utils/globals';
import { sortByCol } from '../utils/sort';
import { addLineId, addLinesId } from '../utils/computations';

export const linesInitialState = {
  cols: [
    { id: UNIQUE_KEY_COL_ID, title: 'Id', type: 'Text', required: true, width: '0' },
    { id: DATE_COL_ID, title: 'Date', type: 'Date', required: true, width: '150px' },
    { id: INVOICE_NUMBER_COL_ID, title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
    { id: 'client', title: 'Client', type: 'Text', required: false, width: '100px' },
    // eslint-disable-next-line max-len
    { id: 'debit', title: 'Compte débité', type: 'Select', required: true, width: '80px', defaultParamKey: PARAMETER_DEFAULT_DEBIT_ACCOUNT },
    { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '150px' },
    { id: VAT_TYPE_COL_ID, title: 'Type TVA', type: 'Select', required: true, width: '80px', defaultParamKey: PARAMETER_DEFAULT_CREDIT_TYPE },
    { id: VAT_RATE_COL_ID, title: 'TVA', type: 'Select', required: false, width: '50px', defaultParamKey: PARAMETER_DEFAULT_VAT },
    { id: AMOUNT_EXCLUDING_TAX_COL_ID, title: 'Montant HT', type: 'Number', required: false, width: '100px' },
    { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
    // eslint-disable-next-line max-len
    { id: 'mode', title: 'Mode', type: 'Select', required: false, width: '50px', defaultParamKey: PARAMETER_DEFAULT_CASHING },
    // eslint-disable-next-line max-len
    { id: 'credit', title: 'Compte crédité', type: 'Text', required: true, width: '80px', defaultParamKey: PARAMETER_DEFAULT_CREDIT_ACCOUNT },
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
      newLines = addLinesId(action.initLines);
      sortByCol(newLines, DATE_COL_ID);
      newHighlightedLines = [];
      newSelectedLines = [];
      break;
    case 'lineChange':
      newLines[action.lineNumber][action.col.id] = action.val;
      if (action.col.id === AMOUNT_EXCLUDING_TAX_COL_ID
          || action.col.id === VAT_RATE_COL_ID) {
        const vatRate = action.col.id === VAT_RATE_COL_ID ? action.val : newLines[action.lineNumber][VAT_RATE_COL_ID];
        const exclTax = action.col.id === AMOUNT_EXCLUDING_TAX_COL_ID ? action.val : newLines[action.lineNumber][AMOUNT_EXCLUDING_TAX_COL_ID];
        const vat = vatRate / 100;
        newLines[action.lineNumber][AMOUNT_INCLUDING_TAX_COL_ID] = Math.round(exclTax * (1 + vat) * 100) / 100;
      }
      newUnsaved = true;
      break;
    case 'addLine':
      newLines.push(addLineId({}));
      cols.forEach(col => {
        if (col.defaultValue) {
          newLines[newLines.length - 1][col.id] = col.defaultValue;
        }
      });
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
          newLines.push(addLineId({ ...line }));
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
