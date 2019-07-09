import React from 'react';
import './App.css';

import { Provider, createClient } from 'urql';
import { Query } from "urql";

const client = createClient({
  url: 'https://api.graph.cool/simple/v1/cjxjga8d15hyw0127luhbm9eh',
});

const AppWithProvider = () => (
  <Provider value={client}>
    <App/>
  </Provider>
);

const listCoins = `
  query listCoins($limit: Int!) {
    allCoins(first:$limit) {
      id name price symbol
    }
  }
`;

function CoinsList({ limit = 10 }) {
  return (
    <Query query={listCoins} variables={{ limit: parseInt(limit) }}>
      {({ fetching, data, error }) => {
        if (fetching) {
          return "Loading...";
        } else if (error) {
          return "Error loading coins";
        }

        return (
          <div className="card-container">
            {data.allCoins.map((c) => (
              <div className="card" key={c.id}>
                <div className="name">{c.name}</div>
                <div className="price">{c.price}</div>
                <div className="symbol">{c.symbol}</div>
              </div>
            ))} 
          </div>
        );
      }}
    </Query>
  );
};

function App() {

  return (
    <div className="App">
      <div className="app-body">
        <CoinsList limit="10"/>
      </div>
    </div>
  );
}

export default AppWithProvider;
