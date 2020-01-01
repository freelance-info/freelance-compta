import React from 'react';
import logo from './logo.svg';
import './App.css';
import AccountLedger from './components/AccountLedger';
import Invoices from './components/Invoices';
import { Tab } from 'semantic-ui-react';

function App() {

  const panes = [
    { menuItem: 'Livre des recettes', render: () => <Tab.Pane style={{overflowX: 'auto'}}><AccountLedger></AccountLedger> </Tab.Pane> },
    { menuItem: 'Factures', render: () => <Tab.Pane><Invoices></Invoices> </Tab.Pane> },
    { menuItem: 'Clients', render: () => <Tab.Pane>Clients</Tab.Pane> },
  ]
  
  return (
    <main style={{ padding: '10px'}}>
      <Tab panes={panes} />
    </main>
  );
}

export default App;
