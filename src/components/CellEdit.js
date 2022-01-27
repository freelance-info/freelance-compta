import React from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import {
  string,
  func,
  shape,
  node,
} from 'prop-types';

const CellEdit = ({
  lineId,
  def,
  value,
  onChange,
}) => {
  const theValue = value === null || value === undefined ? def.defaultValue : value;
  const divStyle = { minWidth: def.width };
  const key = `input-${def.id}-${lineId}`;
  let result;
  let div;
  switch (def.type) {
    case 'Text':
      div = (
        <div className="ui input fluid" style={divStyle}>
          <input
            key={key}
            name={key}
            type="text"
            required
            placeholder={def.title}
            value={theValue || ''}
            onChange={event => onChange(event.target.value)}
          />
        </div>
      );
      result = <Popup content={theValue || ''} trigger={div} />;
      break;
    case 'Number':
      result = (
        <div className="ui right labeled input fluid" style={divStyle}>
          <input
            key={key}
            type="number"
            name={key}
            required
            min="0"
            step="100"
            placeholder={def.title}
            value={theValue || ''}
            onChange={event => onChange(event.target.value)}
          />
          <div className="ui basic label">€</div>
        </div>
      );
      break;
    case 'Date':
      result = (
        <div className="ui input fluid" style={divStyle}>
          <input
            key={key}
            type="date"
            name={key}
            required
            min="2000-01-01"
            max="2100-01-01"
            placeholder={def.title}
            value={theValue || ''}
            onChange={event => onChange(event.target.value)}
          />
        </div>
      );
      break;
    case 'Select':
      div = (
        <div className="ui input fluid" style={divStyle}>
          <Dropdown
            key={key}
            fluid
            compact
            selection
            floating
            options={def.options}
            value={theValue || ''}
            onChange={(_event, { value: val }) => onChange(val)}
          />
        </div>
      );
      result = <Popup key={`popup-${key}`} content={theValue || ''} trigger={div} />;
      break;
    default:
  }

  return result;
};

CellEdit.propTypes = {
  def: shape({
    type: string.isRequired,
    title: string.isRequired,
    width: string,
  }).isRequired,
  lineId: string, // Unique ID of the line, to use in key prop
  value: node, // number, string, date, array
  onChange: func.isRequired,
};

CellEdit.defaultProps = { value: null };

export default CellEdit;
