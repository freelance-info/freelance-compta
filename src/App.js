import React from 'react';
import { Tab } from 'semantic-ui-react';
import AccountLedger from './components/AccountLedger';
import Parameters from './components/Parameters';
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from './reducers/globals';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parameters: new Map(),
      showParam: false,
      tabFiles: [],
    };
    this.onSaveParameters = this.onSaveParameters.bind(this);
    this.onTabFilesChange = this.onTabFilesChange.bind(this);
  }

  componentDidMount() {
    const { parameters } = this.state;

    if (parameters.size === 0) {
      // Try to load from local storage
      const savedParameters = new Map();
      PARAMETER_KEYS.forEach((_value, key) => {
        const value = localStorage.getItem(key);
        if (value) {
          savedParameters.set(key, value);
        }
      });
      if (savedParameters.size < PARAMETER_KEYS.size) {
        // If parameters are missing, open the parameter popup to force user to set them
        this.setState({ showParam: true });
      }
      this.setState({ parameters: savedParameters });
    }

    // Window title
    let title = 'Freelance-compta';
    if (parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    document.querySelector('title').innerText = title;
  }

  onSaveParameters(parametersValue) {
    this.setState({ parameters: parametersValue });
    PARAMETER_KEYS.forEach((_value, parameterKey) => localStorage.setItem(parameterKey, parametersValue.get(parameterKey)));
    this.setState({ showParam: false });
  }

  onTabFilesChange(filePath) {
    this.setState(prevState => {
      const newTabFiles = [...prevState.tabFiles];
      newTabFiles[0] = filePath;
      return { tabFiles: newTabFiles };
    });
  }

  render() {
    const { parameters, showParam, tabFiles } = this.state;

    // Tabs
    const displayableTabFiles = tabFiles.map(tabFile => tabFile.replace(new RegExp('^.*[\\/]'), ''));
    const panes = [
      {
        menuItem: displayableTabFiles[0],
        render: () => (
          <Tab.Pane style={{ overflowX: 'auto' }}>
            <AccountLedger key="account-ledger" parameters={parameters} fileChange={this.onTabFilesChange} />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <main style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
        <button
          type="button"
          className="ui icon button gray"
          style={{ alignSelf: 'flex-end', marginBottom: '-35px' }}
          onClick={() => this.setState({ showParam: true })}
          title="Paramètres"
        >
          <i className="cog icon" />
        </button>
        <Parameters
          parameterKeys={PARAMETER_KEYS}
          initialParametersValue={parameters}
          open={showParam}
          close={this.onSaveParameters}
        />
        <Tab panes={panes} />
      </main>
    );
  }
}

export default App;
