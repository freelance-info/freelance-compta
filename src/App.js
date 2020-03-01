import React from 'react';
import AccountLedger from './components/AccountLedger';
import Parameters from './components/Parameters';
import { Tab } from 'semantic-ui-react';
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from './helpers/globals';

class App extends React.Component {

  state = {
    parameters: new Map(),
    showParam: false,
    tabFiles:[],
  };

  componentDidMount() {
    if (this.state.parameters.size === 0) {
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
        this.setState({showParam: true});
      }
      this.setState({parameters:savedParameters});
    };
  
    // Window title
    let title = 'Comptabilité';
    if (this.state.parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${this.state.parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    document.querySelector('title').innerText = title;
  }
  render() {

    // Tabs
    const displayableTabFiles = this.state.tabFiles.map(tabFile => tabFile.replace(/^.*[\\\/]/, ''));
    const panes = [
      {
        menuItem: displayableTabFiles[0], render: () => {
          return (
            <Tab.Pane style={{ overflowX: 'auto' }}>
              <AccountLedger parameters={this.state.parameters} fileChange={this.onTabFilesChange}></AccountLedger>
            </Tab.Pane>
          );
        }
      },
    ];

    return (
      <main style={ { padding: '10px', display: 'flex', flexDirection: 'column' } }>
        <button className="ui icon button gray" style={ { alignSelf: 'flex-end', marginBottom: '-35px' } } onClick={() => this.setState({showParam: true})} title="Paramètres">
          <i className="cog icon"></i>
        </button>
      <Parameters parameterKeys={ PARAMETER_KEYS } initialParametersValue={ this.state.parameters } open={ this.state.showParam } close={ this.onSaveParameters }></Parameters>
      <Tab panes={ panes }></Tab>
      </main>
    );
  }

  onSaveParameters = (parametersValue) => {
    this.setState({parameters:parametersValue});
    PARAMETER_KEYS.forEach(parameterKey => localStorage.setItem(parameterKey, parametersValue.get(parameterKey)));
    this.setState({showParam: false});
  };

  onTabFilesChange = (filePath) => {
    console.log(`onTabFilesChange(${filePath})`)
    
    this.setState(prevState => {
      const newTabFiles = [...prevState.tabFiles];
      newTabFiles[0] = filePath;
      return {tabFiles: newTabFiles};
    });
  };
}

export default App;
