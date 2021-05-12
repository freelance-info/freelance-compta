import React, { useState, useEffect, useMemo } from 'react';
import {
  func, bool, arrayOf, string, shape, any,
} from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Table } from './Table';
import { getQuarters, getStartDateOfQuarter, getEndDateOfQuarter } from '../utils/date';

export const Reporting = ({ open, setOpen, lines, cols }) => {
  const reportingCols = cols.filter(col => !['ref', 'debit', 'credit', 'mode'].includes(col.id));
  const dateCol = cols.find(col => col.type === 'Date').id;

  const quarterOptions = useMemo(() => {
    const dateMin = lines.reduce((min, line) => (!min || (line[dateCol] && line[dateCol] < min) ? line[dateCol] : min), null);
    const dateMax = lines.reduce((max, line) => (!max || (line[dateCol] && line[dateCol] > max) ? line[dateCol] : max), null);
    const quarters = getQuarters(dateMin, dateMax);
    const options = Object.keys(quarters).flatMap(year => quarters[year].map(quarter => (
      {
        key: `${year}-${quarter}`,
        value: `${year}-${quarter}`,
        text: `${year} - trimestre ${quarter}`,
      }
    )));
    return options;
  }, [dateCol, lines]);

  const [startQuarter, setStartQuarter] = useState(quarterOptions[0].value);
  const [endQuarter, setEndQuarter] = useState(quarterOptions[quarterOptions.length - 1].value);
  const [filteredLines, setFilteredLines] = useState(lines);

  useEffect(() => {
    const startDate = getStartDateOfQuarter(startQuarter);
    const endDate = getEndDateOfQuarter(endQuarter);
    setFilteredLines(lines.filter(line => line[dateCol] && line[dateCol] > startDate && line[dateCol] <= endDate));
  }, [cols, lines, startQuarter, endQuarter]);

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
              <Form.Select
                compact
                style={{ width: '200px' }}
                options={quarterOptions}
                value={startQuarter}
                onChange={(_event, { value: val }) => setStartQuarter(val)}
                placeholder="Début de la période"
              />
            </Form.Field>
            <Form.Field inline>
              <Form.Select
                compact
                style={{ width: '200px' }}
                options={quarterOptions}
                value={endQuarter}
                onChange={(_event, { value: val }) => setEndQuarter(val)}
                placeholder="Fin de la période"
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Table
          key="reporting-table"
          cols={reportingCols}
          lines={filteredLines}
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

Reporting.propTypes = {
  open: bool,
  setOpen: func,
  // eslint-disable-next-line react/forbid-prop-types
  lines: arrayOf(any),
  cols: arrayOf(
    shape({
      id: string.isRequired,
      type: string.isRequired,
      title: string.isRequired,
      width: string,
    }),
  ),
};

Reporting.defaultProps = {
  open: false,
  setOpen: () => {},
  lines: [],
  cols: [],
};
