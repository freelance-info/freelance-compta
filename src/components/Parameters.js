import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select } from 'semantic-ui-react';
import { func, instanceOf, bool } from 'prop-types';
import { PARAMETER_KEYS } from '../utils/globals';
import Logo from '../Logo/Logo';

const Parameters = ({ initialParametersValue, open, close }) => {
  const [parameterValues, setParameterValues] = useState(new Map(initialParametersValue));

  useEffect(() => {
    setParameterValues(new Map(initialParametersValue));
  }, [initialParametersValue]);

  const [errorMessage, setErrorMessage] = useState(undefined);

  const onValidate = () => {
    let allFieldsOk = true;
    PARAMETER_KEYS.forEach((_value, parameterKey) => {
      if (parameterValues.get(parameterKey) === null || parameterValues.get(parameterKey) === undefined) {
        setErrorMessage('Vous devez remplir tous les champs.');
        allFieldsOk = false;
      }
    });
    if (allFieldsOk) {
      close(parameterValues);
    }
  };

  const onChange = (parameterKey, value) => {
    setParameterValues(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(parameterKey, value);
      return newMap;
    });
  };

  const parameters = [];
  PARAMETER_KEYS.forEach((parameterOptions, parameterKey, index) => {
    let input;
    const value = parameterValues.get(parameterKey);

    if (!parameterOptions) {
      input = (
        <input
          id={`param-${index}`}
          type="text"
          placeholder={parameterKey}
          onChange={event => onChange(parameterKey, event.target.value)}
          value={value || ''}
        />
      );
    } else {
      input = (
        <Select
          compact
          options={parameterOptions}
          onChange={(_event, { value: val }) => onChange(parameterKey, val)}
          value={value}
        />
      );
    }
    parameters.push(
      // eslint-disable-next-line react/no-array-index-key
      <Form.Field key={parameterKey}>
        <label>{parameterKey}</label>
        { input}
      </Form.Field>,
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
  initialParametersValue: instanceOf(Map).isRequired, // Map
  open: bool.isRequired,
  close: func.isRequired,
};

export default Parameters;
