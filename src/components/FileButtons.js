import React from 'react';
import { func, bool } from 'prop-types';
import { ConfirmButton } from './ConfirmButton';

const FileButtons = ({ hasUnsavedChanges, onNew, onOpen, onSave, onSaveAs }) => {

  const newButtonClick = hasUnsavedChanges ? () => {} : onNew;
  const openButtonClick = hasUnsavedChanges ? () => {} : onOpen;

  const newButton = (
    <button
      key="newButton"
      type="button"
      className="ui icon button green"
      onClick={() => newButtonClick}
      title="Nouveau"
    >
      <i aria-hidden="true" className="file outline icon" />
    </button>
  );

  const openButton = (
    <button
      key="openButton"
      type="button"
      className="ui icon button green"
      onClick={openButtonClick}
      title="Ouvrir"
    >
      <i aria-hidden="true" className="folder open icon" />
    </button>
  );
  const saveButton = (
    <button
      key="saveButton"
      type="button"
      className="ui icon button green"
      onClick={onSave}
      title="Enregistrer"
    >
      <i aria-hidden="true" className="save icon" />
      { hasUnsavedChanges && <sup>●</sup> }
    </button>
  );
  const saveAsButton = (
    <button
      key="saveAsButton"
      type="button"
      className="ui icon button green"
      onClick={onSaveAs}
      title="Enregistrer sous"
    >
      <i aria-hidden="true" className="clone icon" />
    </button>
  );

  const buttons = [];

  if (hasUnsavedChanges) {
    const confirmText = 'Vos modifications ne sont pas encore enregistrées! Voulez-vous les perdre et continuer ?';
    buttons.push(<ConfirmButton key="newConfirmButton" text={confirmText} button={newButton} onOk={onNew} />);
    buttons.push(<ConfirmButton key="newOpenButton" text={confirmText} button={openButton} onOk={onOpen} />);
  } else {
    buttons.push(newButton);
    buttons.push(openButton);
  }

  buttons.push(saveButton);
  buttons.push(saveAsButton);

  return <div>{ buttons }</div>;
};

FileButtons.propTypes = {
  hasUnsavedChanges: bool.isRequired,
  onNew: func.isRequired,
  onOpen: func.isRequired,
  onSave: func.isRequired,
  onSaveAs: func.isRequired,
};

export default FileButtons;
