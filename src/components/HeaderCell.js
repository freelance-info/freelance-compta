import React from 'react';
import { PropTypes, shape } from 'prop-types';

export const HeaderCell = ({col, sort, onSort}) => (
  <th
    key={`header-cell-${col.id}`}
    onClick={() => onSort(col.id)}
    className={sort.column === col.id ? `sorted ${sort.direction}` : 'sorted'}
  >
    {col.title}
  </th>
);

HeaderCell.propTypes = {
  col: shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  sort: shape({
    column: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
  onSort: PropTypes.func,
};

HeaderCell.defaultProps = {
  sort: {
    column: null,
    direction: null,
  },
  onSort: () => {},
};
