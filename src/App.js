import React from 'react';
import './App.css';

import { Provider, createClient } from 'urql';

const client = createClient({
  url: 'https://api.graph.cool/simple/v1/cjxjga8d15hyw0127luhbm9eh',
});

const AppWithProvider = () => (
  <Provider value={client}>
    <App/>
  </Provider>
);

function App() {

  return (
    <div className="App">
      <div className="app-body">
      Crypto-App
      </div>
    </div>
  );
}

export default AppWithProvider;
