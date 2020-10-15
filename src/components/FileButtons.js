import React from 'react';
import { func } from 'prop-types';

const FileButtons = ({ onOpen, onSave, onSaveAs }) => (
  <div>
    <button
      type="button"
      className="ui icon button green"
      onClick={onOpen}
      title="Ouvrir"
    >
      <i aria-hidden="true" className="folder open icon" />
    </button>
    <button
      type="button"
      className="ui icon button green"
      onClick={onSaveAs}
      title="Enregistrer sous"
    >
      <i aria-hidden="true" className="copy icon" />
    </button>
    <button
      type="button"
      className="ui icon button green"
      onClick={onSave}
      title="Enregistrer"
    >
      <i aria-hidden="true" className="save icon" />
    </button>
  </div>
);

FileButtons.propTypes = {
  onOpen: func.isRequired,
  onSave: func.isRequired,
  onSaveAs: func.isRequired,
};

export default FileButtons;
