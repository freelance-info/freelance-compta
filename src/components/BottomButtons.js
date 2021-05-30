import React from 'react';
import { func, bool } from 'prop-types';
import { Button } from 'semantic-ui-react';

export const BottomButtons = ({
  hasSelectedLines, addLine, removeLines, duplicateLines, vat,
}) => (
  <div>
    <Button
      positive
      labelPosition="right"
      icon="plus"
      content="Nouvelle ligne"
      onClick={addLine}
    />
    <Button
      color="red"
      labelPosition="right"
      icon="trash"
      content="Supprimer les lignes"
      disabled={!hasSelectedLines}
      onClick={removeLines}
    />
    <Button
      primary
      labelPosition="right"
      icon="copy"
      content="Dupliquer les lignes"
      disabled={!hasSelectedLines}
      onClick={duplicateLines}
    />
    <Button
      color="pink"
      labelPosition="right"
      icon="table"
      content="Déclaration TVA"
      onClick={vat}
    />
  </div>
);

BottomButtons.propTypes = {
  hasSelectedLines: bool.isRequired,
  addLine: func.isRequired,
  removeLines: func.isRequired,
  duplicateLines: func.isRequired,
  vat: func.isRequired,
};
