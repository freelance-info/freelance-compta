import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react'
import { Table } from './Table';

export const Reporting = ({ open, setOpen, lines, cols }) => {

  const reportingCols = cols.filter(col => !['ref', 'debit', 'credit', 'mode'].includes(col.id));

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Rapports</Modal.Header>
      <Modal.Content>
        <Table
          key="reporting-table"
          cols={reportingCols}
          lines={lines}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button
          content="Print"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};