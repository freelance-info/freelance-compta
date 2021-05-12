import React, { useState, useEffect } from 'react';
import { Row } from './Row';

export const Reports = (cols, lines) => {
  const dateCol = cols.find(col => col.type === 'Date').id;
  const dateMin = lines.reduce((min, line) => (!min || (line[dateCol] && line[dateCol] < min) ? line[dateCol] : min), null);
  const dateMax = lines.reduce((max, line) => (!max || (line[dateCol] && line[dateCol] > max) ? line[dateCol] : max), null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredLines, setFilteredLines] = useState(lines);

  const onStartDateChange = newDate => setStartDate(newDate);
  const onEndDateChange = newDate => setEndDate(newDate);

  useEffect(() => {
    setFilteredLines(lines.filter(line => line[dateCol] && line[dateCol] > startDate && line[dateCol] <= endDate));
  }, [cols, lines, startDate, endDate]);

  const rows = filteredLines.map((line, index) => <Row cols={cols} line={line} lineNumber={index} />);

  return (
    <section>
      <section>
        <label>
          Début de la période :
          <input
            type="date"
            min={dateMin}
            max={dateMax}
            value={startDate || ''}
            onChange={event => onStartDateChange(event.target.value)}
          />
        </label>
        <label>
          Fin de la période :
          <input
            type="date"
            min={dateMin}
            max={dateMax}
            value={startDate || ''}
            onChange={event => onEndDateChange(event.target.value)}
          />
        </label>
      </section>
      <article>
        <header>Formulaire 3310</header>
        <section>
          <table>
            { rows }
          </table>
          <table>
            <tr>
              <th colSpan="2">Cadre A : Base hors TVA</th>
            </tr>
            <tr>
              <td>01 : prestation de services</td>
              <td>0</td>
            </tr>
            <tr>
              <td>02 : autres opérations imposables</td>
              <td>0</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colSpan="2">Cadre B : Décompte TVA à payer</th>
            </tr>
            <tr>
              <th>Taux</th>
              <th>Base HT</th>
              <th>TVA due</th>
            </tr>
            <tr>
              <td>08 : 20%</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>09 : 5.5%</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>09B : 10%</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>10 : 8.5%</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>11 : 2.1%</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </table>
        </section>
      </article>
    </section>
  );
};
