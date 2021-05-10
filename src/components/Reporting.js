import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Table } from './Table';
import { findMinDate, findMaxDate } from '../utils/date';

export const Reporting = ({ open, setOpen, lines, cols }) => {

  const reportingCols = cols.filter(col => !['ref', 'debit', 'credit', 'mode'].includes(col.id));

  const dates = lines.map(line => line.date);

  const minDate = findMinDate(dates, '2000-01-01');
  const [startDate, setStartDate] = useState(minDate);
  const startDateChange = val => { setStartDate(val); };
  const maxDate = findMaxDate(dates, '2100-01-01');
  const [endDate, setEndDate] = useState(maxDate);
  const endDateChange = val => { setEndDate(val); };

  return (
    <Modal
      size="fullscreen"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        Rapports
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group>
            <Form.Field inline>
              <Form.Input
                type="date"
                required
                label="Début de période"
                min={minDate}
                max={maxDate}
                value={startDate}
                onChange={event => startDateChange(event.target.value)}
              />
            </Form.Field>
            <Form.Field inline>
              <Form.Input
                type="date"
                required
                label="Fin de période"
                min={minDate}
                max={maxDate}
                value={endDate}
                onChange={event => endDateChange(event.target.value)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Table
          key="reporting-table"
          cols={reportingCols}
          lines={lines}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};