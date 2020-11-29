import React from 'react';
import { PropTypes, shape, string } from 'prop-types';
import CellEdit from './CellEdit';
import { Checkbox } from 'semantic-ui-react';

export const Row = ({cols, line, lineNumber, errors, highlightedLines, selectedLines, select, rowChange}) => {
  // Return error message to display if any for given line / column
  const getErrorMsg = (lineNumber, errorLines, col) => {
    const error = errorLines.filter(err => err.lineNumber === lineNumber);
    if (error.length === 0) {
      return null;
    }
    if (error[0].cols.some(errorCol => col.id === errorCol.id)) {
      return (<i className="icon attention" title="Obligatoire" />);
    }
    return '';
  };

  const td = cols.map(col => {
    const key = `body-cell-${lineNumber}-${col.id}`;
    const errorMsg = getErrorMsg(lineNumber, errors, col);
    return (
      <td key={key} id={key} className={errorMsg ? 'error' : ''}>
        <CellEdit
          key={`cell-edit-${key}`}
          id={`cell-edit-${key}`}
          def={col}
          value={line[col.id]}
          onChange={val => rowChange(lineNumber, col, val)}
        />
        {errorMsg || ''}
      </td>
    );
  });
  return (
    <tr
      key={`body-line-${lineNumber}`}
      className={highlightedLines.includes(lineNumber) ? 'positive' : ''}
    >
      <td key={`body-check-${lineNumber}`}>
        <Checkbox
          checked={selectedLines.some(selectedLine => selectedLine === lineNumber)}
          onChange={(e, { checked }) => select(lineNumber, checked)}
        />
      </td>
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
    })
  ).isRequired,
  line: PropTypes.object.isRequired,
  lineNumber: PropTypes.number.isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape({
    col: shape({
      id: PropTypes.string.isRequired,
    }),
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
