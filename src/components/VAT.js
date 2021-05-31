/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */

// Value-Added Tax (TVA in french)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  func, bool, arrayOf, string, shape, any,
} from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import {
  CREDIT_TYPES, DATE_COL_ID, VAT_TYPE_COL_ID, VAT_RATES, VAT_RATE_COL_ID,
} from '../utils/globals';
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

  const toTaxableLine = useCallback(creditType => {
    const creditTypeSum = filteredLines
      .filter(l => l[VAT_TYPE_COL_ID] === creditType.value)
      .reduce((prev, cur) => prev + cur.ht, 0);
    return (
      <tr key={creditType.key}>
        <td>{creditType.text}</td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={creditTypeSum} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
      </tr>
    );
  }, [filteredLines]);

  const toVatLine = useCallback(rate => {
    const vatTypeSum = filteredLines
      .filter(l => l[VAT_RATE_COL_ID] === rate.value)
      .reduce((prev, cur) => prev + cur.ht, 0);
    const vatAmount = Math.round(vatTypeSum * rate.value) / 100;
    return (
      <tr key={rate.key}>
        <td>{rate.text}</td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={vatTypeSum} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={vatAmount} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
      </tr>
    );
  }, [filteredLines]);

  const taxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => creditType.isTaxable).map(toTaxableLine), [filteredLines]);
  const notTaxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => !creditType.isTaxable).map(toTaxableLine), [filteredLines]);
  const vatLines = useMemo(() => VAT_RATES.map(toVatLine), [filteredLines]);

  return (
    <Modal
      size="large"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <div className="ui centered three column grid">
          <img src={VAT_SVG} alt="Logo Impots" style={{ width: '100px' }} className="ui column" />
          <h2 className="ui column">Déclaration de TVA N° 3310</h2>
          <div className="ui column" style={{ width: '100px', alignItems: 'center', display: 'flex' }}><Button color="black" onClick={() => setOpen(false)}>Fermer</Button></div>
        </div>
      </Modal.Header>
      <Modal.Content>
        <main className="ui container">
          <section className="ui segments">
            <Form className="ui segment">
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
            <details className="ui segment">
              <summary>Voir les lignes sélectionnées</summary>
              <Table
                key="reporting-table"
                cols={reportingCols}
                lines={filteredLines}
              />
            </details>
            <section className="ui segment fluid">
              <h3>A - MONTANT DES OPERATIONS REALISEES</h3>
              <table className="ui celled table">
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
            <section className="ui segment">
              <h3>B - DECOMPTE TVA À PAYER</h3>
              <table className="ui celled table">
                <thead>
                  <tr>
                    <th>TVA BRUTE</th>
                    <th>BASE HT</th>
                    <th>TAXE DUE</th>
                  </tr>
                </thead>
                <tbody>{vatLines}</tbody>
              </table>
              <table />
            </section>
          </section>
        </main>
      </Modal.Content>
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
