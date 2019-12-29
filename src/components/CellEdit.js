import React from 'react';
export default function CellEdit({def, value, onChange}) {
    let input;
    switch(def.type) {
        case 'Text':
            input = (<input type="text" required style={{maxWidth: def.width}} placeholder={ def.label } value={ value || '' } onChange={ (event) => onChange(event.target.value) } />);
            break;
        case 'Number':
            input = (<input type="number" required min="0" step="100" style={{maxWidth: def.width}} placeholder={ def.label } value={ value || '' } onChange={ (event) => onChange(event.target.value) } />);
            break;
        case 'Date':
            input = (<input type="date" required min="2000-01-01" max="2100-01-01" style={{width: '150px'}} placeholder={ def.label } value={ value || '' } onChange={ (event) => onChange(event.target.value) } />);
            break;
        default:
    }
    return (
        <div className="ui input">
            { input }
        </div>
    );
}