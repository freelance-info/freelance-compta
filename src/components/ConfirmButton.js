import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { string, func, element } from 'prop-types';

export const ConfirmButton = ({ text, button, onOk }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Modal onClose={() => setVisible(false)} onOpen={() => setVisible(true)} open={visible} trigger={button}>
      <Modal.Content className="content">
        { text }
      </Modal.Content>
      <Modal.Actions>
        <button type="button" className="ui red basic cancel button" onClick={() => setVisible(false)}>
          Annuler
        </button>
        <button type="button" className="ui green ok button" onClick={() => { setVisible(false); onOk(); }}>
          OK
        </button>
      </Modal.Actions>
    </Modal>
  );
};

ConfirmButton.propTypes = {
  text: string.isRequired,
  button: element.isRequired,
  onOk: func.isRequired,
};
