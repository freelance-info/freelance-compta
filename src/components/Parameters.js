import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Button, Select,
} from 'semantic-ui-react';
import {
  func, instanceOf, string, arrayOf, bool,
} from 'prop-types';
import {
  PARAMETER_DEFAULT_CASHING, PARAMETER_DEFAULT_TVA, OPTIONS_TVA, OPTIONS_CASHING,
} from '../helpers/globals';
import Logo from '../Logo/Logo';

const Parameters = ({
  parameterKeys, initialParametersValue, open, close,
}) => {
  const [parameterValues, setParameterValues] = useState(new Map(initialParametersValue));

  useEffect(() => {
    setParameterValues(new Map(initialParametersValue));
  }, [initialParametersValue]);

  const [errorMessage, setErrorMessage] = useState(undefined);

  const onValidate = () => {
    const allFieldsOk = parameterKeys.every(parameterKey => !!parameterValues.get(parameterKey));
    if (allFieldsOk) {
      close(parameterValues);
    } else {
      setErrorMessage('Vous devez remplir tous les champs.');
    }
  };

  const onChange = (parameterKey, value) => {
    setParameterValues(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(parameterKey, value);
      return newMap;
    });
  };

  const parameters = parameterKeys.map((parameterKey, index) => {
    let input;
    const value = parameterValues.get(parameterKey);

    switch (parameterKey) {
      case PARAMETER_DEFAULT_CASHING:
        input = (
          <Select
            compact
            options={OPTIONS_CASHING}
            onChange={(_event, { value: val }) => onChange(parameterKey, val)}
            value={value}
          />
        );
        break;
      case PARAMETER_DEFAULT_TVA:
        input = (
          <Select
            compact
            options={OPTIONS_TVA}
            onChange={(_event, { value: val }) => onChange(parameterKey, val)}
            value={value}
          />
        );
        break;
      default:
        input = (
          <input
            id={`param-${index}`}
            placeholder={parameterKey}
            onChange={event => onChange(parameterKey, event.target.value)}
            value={value || ''}
          />
        );
    }
    return (
      <Form.Field key={parameterKey}>
        <label>{parameterKey}</label>
        { input}
      </Form.Field>
    );
  });

  const errorDiv = errorMessage ? (
    <div className="ui message negative" style={{ display: 'flex', marginTop: '0' }}>
      <i className="times circle outline icon" />
      <div className="content">
        <div className="header">{errorMessage}</div>
      </div>
    </div>
  ) : '';

  return (
    <Modal
      open={open}
      closeOnEscape={false}
      closeOnDimmerClick={false}
    >
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Paramètres généraux</span>
        <Logo />
      </Modal.Header>
      <Modal.Content>
        <Form>
          {parameters}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {errorDiv}
        <Button
          onClick={onValidate}
          positive
          labelPosition="right"
          icon="checkmark"
          content="Valider"
        />
      </Modal.Actions>
    </Modal>
  );
};

Parameters.propTypes = {
  parameterKeys: arrayOf(string.isRequired).isRequired,
  initialParametersValue: instanceOf(Map).isRequired, // Map
  open: bool.isRequired,
  close: func.isRequired,
};

export default Parameters;
