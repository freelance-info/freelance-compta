import React from 'react';
import { Select } from 'semantic-ui-react';
import {
  string, func, shape, node,
} from 'prop-types';

const CellEdit = ({ def, value, onChange }) => {
  let input;
  switch (def.type) {
    case 'Text':
      input = (
        <input
          type="text"
          required
          style={{ maxWidth: def.width }}
          placeholder={def.title}
          value={value || ''}
          onChange={event => onChange(event.target.value)}
        />
      );
      break;
    case 'Number':
      input = (
        <div className="ui right labeled input">
          <input
            type="number"
            required
            min="0"
            step="100"
            style={{ maxWidth: def.width }}
            placeholder={def.title}
            value={value || ''}
            onChange={event => onChange(event.target.value)}
          />
          <div className="ui basic label">€</div>
        </div>
      );
      break;
    case 'Date':
      input = (
        <input
          type="date"
          required
          min="2000-01-01"
          max="2100-01-01"
          style={{ width: '150px' }}
          placeholder={def.title}
          value={value || ''}
          onChange={event => onChange(event.target.value)}
        />
      );
      break;
    case 'Select':
      input = (
        <Select
          compact
          style={{ width: def.width }}
          options={def.options}
          value={value || def.defaultValue}
          onChange={(_event, { value: val }) => onChange(val)}
        />
      );
      break;
    default:
  }
  return (
    <div className="ui input">
      { input}
    </div>
  );
};

CellEdit.propTypes = {
  def: shape({
    type: string.isRequired,
    title: string.isRequired,
    width: string,
  }).isRequired,
  value: node, // number, string, date, array
  onChange: func.isRequired,
};

CellEdit.defaultProps = {
  value: null,
};

export default CellEdit;
