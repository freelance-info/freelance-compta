import React, { useContext } from 'react';
import { func } from 'prop-types';
import { Button } from 'semantic-ui-react';
import { LinesContext } from '../contexts/lines.context';

export const BottomButtons = ({ addLine, vat }) => {
  const [{ selectedLines }, dispatchLinesAction] = useContext(LinesContext);
  const removeLines = () => {
    dispatchLinesAction({ type: 'removeSelected' });
  };

  const duplicateLines = () => {
    dispatchLinesAction({ type: 'duplicateSelected' });
  };
  return (
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
        disabled={selectedLines.length === 0}
        onClick={removeLines}
      />
      <Button
        primary
        labelPosition="right"
        icon="copy"
        content="Dupliquer les lignes"
        disabled={selectedLines.length === 0}
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
};

BottomButtons.propTypes = {
  addLine: func.isRequired,
  vat: func.isRequired,
};
