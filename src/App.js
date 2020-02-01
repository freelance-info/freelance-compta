import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import AccountLedger from './components/AccountLedger';
import Parameters from './components/Parameters';
import { Tab } from 'semantic-ui-react';
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from './helpers/globals';



function App() {

  // Initialize parameters
  const [parameters, setParameters] = useState(new Map());
  const [showParam, setShowParam] = useState(false);
  const [tabFiles, setTabFiles] = useState([]);
  useEffect(() => {
    if (parameters.size === 0) {
      // Try to load from local storage
      const savedParameters = new Map();
      PARAMETER_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          savedParameters.set(key, value);
        }
      });
      if (savedParameters.size < PARAMETER_KEYS.length) {
        // If parameters are missing, open the parameter popup to force user to set them
        setShowParam(true);
      }
      setParameters(savedParameters);
    }
  }, [parameters]);

  // Window title
  useEffect(() => {
    let title = 'Comptabilité';
    if (parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    document.querySelector('title').innerText = title;
  }, [parameters]);

  // Tabs
  const displayableTabFiles = tabFiles.map(tabFile => tabFile.replace(/^.*[\\\/]/, ''));
  const panes = [
    { menuItem: displayableTabFiles[0], render: () => 
      (
        <Tab.Pane style={{overflowX: 'auto'}}>
          <AccountLedger parameters={parameters} fileChange={filePath => setTabFiles(prev => {
            const newTabFiles = [...prev]; 
            newTabFiles[0] = filePath; 
            return newTabFiles;
          }) }></AccountLedger>
        </Tab.Pane> 
      )
    },
  ];
  
  return (
    <main style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
      <button className="ui icon button gray" style={ {alignSelf: 'flex-end', marginBottom: '-35px' }} onClick={() => setShowParam(true)} title="Paramètres">
          <i className="cog icon"></i>
      </button>
      <Parameters parameterKeys={PARAMETER_KEYS} initialParametersValue={parameters} open={showParam} close={(parametersValue) => onSaveParameters(setParameters, setShowParam, parametersValue) }></Parameters>
      <Tab panes={panes}></Tab>
    </main>
  );
}

function onSaveParameters(setParameters, setShowParam, parametersValue) {
  setParameters(parametersValue);
  PARAMETER_KEYS.forEach(parameterKey => localStorage.setItem(parameterKey, parametersValue.get(parameterKey)));
  setShowParam(false);
}

export default App;
