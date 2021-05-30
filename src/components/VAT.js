/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */

// Value-Added Tax (TVA in french)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  func, bool, arrayOf, string, shape, any,
} from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import { CREDIT_TYPES, DATE_COL_ID, TYPE_TVA_COL_ID } from '../utils/globals';
import { Table } from './Table';
import { getQuarters, getStartDateOfQuarter, getEndDateOfQuarter } from '../utils/date';
import VAT_SVG from './VAT.svg';

export const VAT = ({ open, setOpen, lines, cols }) => {
  const reportingCols = cols.filter(col => !['ref', 'debit', 'credit', 'mode'].includes(col.id));

  const [startQuarter, setStartQuarter] = useState(null);
  const [endQuarter, setEndQuarter] = useState(null);
  const [filteredLines, setFilteredLines] = useState(lines);

  const quarterOptions = useMemo(() => {
    const dateMin = lines.reduce((min, line) => (!min || (line[DATE_COL_ID] && line[DATE_COL_ID] < min) ? line[DATE_COL_ID] : min), null);
    const dateMax = lines.reduce((max, line) => (!max || (line[DATE_COL_ID] && line[DATE_COL_ID] > max) ? line[DATE_COL_ID] : max), null);
    const quarters = getQuarters(dateMin, dateMax);
    const options = Object.keys(quarters).flatMap(year => quarters[year].map(quarter => (
      {
        key: `${year}-${quarter}`,
        value: `${year}-${quarter}`,
        text: `${year} - trimestre ${quarter}`,
      }
    )));
    setStartQuarter(options[0].value);
    setEndQuarter(options[options.length - 1].value);
    return options;
  }, [DATE_COL_ID, lines]);

  useEffect(() => {
    const startDate = getStartDateOfQuarter(startQuarter);
    const endDate = getEndDateOfQuarter(endQuarter);
    setFilteredLines(lines.filter(line => {
      const lineDate = line[DATE_COL_ID] ? new Date(line[DATE_COL_ID]) : null;
      return lineDate && lineDate > startDate && lineDate <= endDate;
    }));
  }, [cols, lines, startQuarter, endQuarter]);

  const toLine = useCallback(creditType => {
    const creditTypeSum = filteredLines
      .filter(l => l[TYPE_TVA_COL_ID] === creditType.value)
      .reduce((prev, cur) => prev + cur.ht, 0);
    return (
      <tr key={creditType.key} className="ligne">
        <td className="cell-texte align-gauche">
          <div className="libelle">
            <span>{creditType.text}</span>
          </div>
        </td>
        <td className="cell-data numerique N15 align-gauche">
          <div className="ui right labeled input">
            <input type="text" value={creditTypeSum} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
      </tr>
    );
  }, []);

  const taxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => creditType.isTaxable).map(toLine), [filteredLines]);
  const notTaxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => !creditType.isTaxable).map(toLine), [filteredLines]);

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
        <details>
          <summary>Voir les lignes sélectionnées</summary>
          <Table
            key="reporting-table"
            cols={reportingCols}
            lines={filteredLines}
          />
        </details>
        <div className="ui divider" />
        <section>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '500px' }}>
              <h2>Déclaration de TVA N° 3310</h2>
              <h3>A - MONTANT DES OPERATIONS REALISEES</h3>
            </div>
            <img src={VAT_SVG} alt="Logo Impots" style={{ width: '100px' }} />
          </div>
          <table className="ui celled collapsing table">
            <thead>
              <tr>
                <th colSpan="2">OPÉRATIONS IMPOSABLES (HT)</th>
              </tr>
            </thead>
            <tbody>{taxableLines}</tbody>
            <thead>
              <tr>
                <th colSpan="2">OPÉRATIONS NON IMPOSABLES</th>
              </tr>
            </thead>
            <tbody>{notTaxableLines}</tbody>
          </table>
          <table />
        </section>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Fermer
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

VAT.propTypes = {
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

VAT.defaultProps = {
  open: false,
  setOpen: () => { },
  lines: [],
  cols: [],
};
