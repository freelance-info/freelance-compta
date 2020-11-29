import React from 'react';
import { instanceOf, shape, string } from 'prop-types';

export const FooterCell = ({col, computedTotals}) => {
  let total = computedTotals.get(col.id);
  total = total ? `${total}€` : '';
  return (<th key={`total-${col.id}`}>{total}</th>);
};

FooterCell.propTypes = {
  col: shape({
    id: string.isRequired,
  }),
  computedTotals: instanceOf(Map).isRequired,
};

