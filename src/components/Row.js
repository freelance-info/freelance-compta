import React from 'react';
import { PropTypes, shape, string } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { UNIQUE_KEY_COL_ID } from '../utils/globals';

export const Row = ({
  cols, line, lineNumber, errors, highlightedLines, selectedLines, select, rowChange,
}) => {
  // Return error message to display if any for given line / column
  const getErrorMsg = (lineNum, errorLines, col) => {
    const error = errorLines.filter(err => err.lineNumber === lineNum);
    if (error.length === 0) {
      return null;
    }
    if (error[0].cols.some(errorCol => col.id === errorCol.id)) {
      return (<i className="icon attention" title="Obligatoire" />);
    }
    return '';
  };

  const td = cols.map(col => {
    const key = `body-cell-${lineNumber}-${line[UNIQUE_KEY_COL_ID]}`;
    const errorMsg = getErrorMsg(lineNumber, errors, col);
    return (
      <td key={key} id={key} className={errorMsg ? 'error' : ''}>
        {
          rowChange
          && (
          <CellEdit
            key={`cell-edit-${key}`}
            id={`cell-edit-${key}`}
            def={col}
            value={line[col.id]}
            onChange={val => rowChange(lineNumber, col, val)}
          />
          )
        }
        {errorMsg || ''}
      </td>
    );
  });
  return (
    <tr
      key={`body-line-${lineNumber}`}
      className={highlightedLines.includes(lineNumber) ? 'positive' : ''}
    >
      {
        select
        && (
        <td key={`body-check-${lineNumber}`}>
          <Checkbox
            checked={selectedLines.some(selectedLine => selectedLine === lineNumber)}
            onChange={(e, { checked }) => select(lineNumber, checked)}
          />
        </td>
        )
      }
      {td}
    </tr>
  );
};

Row.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: string.isRequired,
      title: string.isRequired,
      width: string,
    }),
  ).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  line: PropTypes.object.isRequired,
  lineNumber: PropTypes.number.isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape({
    col: shape({ id: PropTypes.string.isRequired }),
    lineNumber: PropTypes.number.isRequired,
  })),
  highlightedLines: PropTypes.arrayOf(PropTypes.number),
  selectedLines: PropTypes.arrayOf(PropTypes.number),
  select: PropTypes.func,
  rowChange: PropTypes.func,
};

Row.defaultProps = {
  errors: [],
  highlightedLines: [],
  selectedLines: [],
  select: () => {},
  rowChange: () => {},
};
