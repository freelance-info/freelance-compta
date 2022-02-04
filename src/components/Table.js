import React, { useContext, useState } from 'react';
import { PropTypes, shape } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import { HeaderCell } from './HeaderCell';
import { FooterCell } from './FooterCell';
import { Row } from './Row';
import { computeTotals } from '../utils/computations';
import { UNIQUE_KEY_COL_ID } from '../utils/globals';
import { LinesContext } from '../contexts/lines.context';

export const Table = ({ allSelected, errors }) => {
  const [{ cols, lines, selectedLines, highlightedLines }, dispatchLinesAction] = useContext(LinesContext);

  const [sortState, setSortState] = useState({ column: 'date', direction: 'ascending' });
  const handleSort = clickedColumn => {
    const { column, direction } = sortState;
    const newDirection = column === clickedColumn && direction === 'ascending' ? 'descending' : 'ascending';
    setSortState({ column: clickedColumn, direction: newDirection });
    dispatchLinesAction({ type: 'sortLines', clickedColumn, direction: newDirection });
  };

  const rowChange = (lineNumber, col, val) => {
    dispatchLinesAction({ type: 'lineChange', lineNumber, col, val });
  };

  const selectAll = checked => {
    if (checked) {
      dispatchLinesAction({ type: 'selectAll' });
    } else {
      dispatchLinesAction({ type: 'unselectAll' });
    }
  };

  const select = (lineNumber, checked) => {
    dispatchLinesAction({ type: 'select', checked, lineNumber });
  };

  const headerCells = cols
    .filter(col => col.width !== '0')
    .map(col => (
      <HeaderCell
        key={`header-cell-${col.id}`}
        col={col}
        sort={sortState}
        onSort={handleSort}
      />
    ));

  const rows = lines.map((line, lineNumber) => (
    <Row
      key={`row-${line[UNIQUE_KEY_COL_ID]}`}
      cols={cols}
      line={line}
      lineNumber={lineNumber}
      errors={errors}
      highlightedLines={highlightedLines}
      selectedLines={selectedLines}
      select={select}
      rowChange={rowChange}
    />
  ));

  const computedTotals = computeTotals(lines, cols);
  const footerCells = cols
    .filter(col => col.width !== '0')
    .map(col => (
      <FooterCell
        key={`footer-cell-${col.id}`}
        col={col}
        computedTotals={computedTotals}
      />
    ));

  return (
    <table className="ui table small compact brown sortable">
      <thead>
        <tr>
          {
            select
            && (
            <th key="header-check">
              <Checkbox
                checked={allSelected}
                onChange={(_e, { checked }) => selectAll(checked)}
              />
            </th>
            )
          }
          {headerCells}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
      <tfoot>
        <tr>
          <th>&nbsp;</th>
          {footerCells}
        </tr>
      </tfoot>
    </table>
  );
};

Table.propTypes = {
  allSelected: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.shape({
    col: shape({ id: PropTypes.string.isRequired }),
    lineNumber: PropTypes.number.isRequired,
  })),
};

Table.defaultProps = {
  errors: [],
  allSelected: false,
};
