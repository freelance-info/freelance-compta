import React from 'react';
import { PropTypes, shape, string } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import { HeaderCell } from './HeaderCell';
import { FooterCell } from './FooterCell';
import { Row } from './Row';
import { computeTotals } from '../reducers/computations';

export const Table = ({cols, lines, rowChange, selectedLines, allSelected, select, selectAll, highlightedLines, sort, onSort, errors}) => {
  const headerCells = cols.map(col => (
    <HeaderCell
      key={`header-cell-${col.id}`}
      col={col}
      sort={sort}
      onSort={onSort}
    />
  ));
  
  const rows = lines.map((line, lineNumber) => (
    <Row
      key={`row-${lineNumber}`}
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
  const footerCells = cols.map(col => (
    <FooterCell key={`footer-cell-${col.id}`} col={col} computedTotals={computedTotals} />
  ));
  
  return (
    <table className="ui table small compact brown sortable">
      <thead>
        <tr>
          <th key="header-check">
            <Checkbox
              checked={allSelected}
              onChange={(_e, { checked }) => selectAll(checked)}
            />
          </th>
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
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: string.isRequired,
      title: string.isRequired,
      width: string,
    })
  ).isRequired,
  lines: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowChange: PropTypes.func,
  highlightedLines: PropTypes.arrayOf(PropTypes.number),
  selectedLines: PropTypes.arrayOf(PropTypes.number),
  select: PropTypes.func,
  allSelected: PropTypes.bool,
  selectAll: PropTypes.func, 
  sort: shape({
    column: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
  onSort: PropTypes.func,
  errors: PropTypes.arrayOf(PropTypes.shape({
    col: shape({
      id: PropTypes.string.isRequired,
    }),
    lineNumber: PropTypes.number.isRequired,
  })),
};

Table.defaultProps = {
  errors: [],
  highlightedLines: [],
  selectedLines: [],
  select: () => {},
  rowChange: () => {},
  sort: {
    column: null,
    direction: null,
  },
  onSort: () => {},
};
