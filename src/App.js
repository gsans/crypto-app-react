import React from 'react';
import './App.css';

import { Provider, createClient } from 'urql';
import { Query } from "urql";

import { SubscriptionClient } from 'subscriptions-transport-ws';
import {
  cacheExchange,
  debugExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';

import { Subscription } from 'urql';

const subscriptionClient = new SubscriptionClient(
  'wss://subscriptions.graph.cool/v1/cjxjga8d15hyw0127luhbm9eh',
  {}
);

const client = createClient({
  url: 'https://api.graph.cool/simple/v1/cjxjga8d15hyw0127luhbm9eh',
  exchanges: [
    debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
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

const newCoins = `
 subscription CoinsSub {
   Coin(filter: {
     mutation_in: [CREATED]
   }) {
     node {
       id name price symbol
     }
   }
 }
`;

function CoinsList({ limit = 10 }) {
 return (
   <div>
      <div className="card-container">
        <Subscription query={newCoins}>
          {({ data }) => {
            if (!data || !data.Coin) return null;
            debugger
            const c = data.Coin.node;
            return (
              <>
                {(
                  <div className="card" key={c.id}>
                    <div className="name">{c.name}</div>
                    <div className="price">{c.price}</div>
                    <div className="symbol">{c.symbol}</div>
                  </div>
                )}
              </>
            )
          }}
        </Subscription>
        <Query query={listCoins} variables={{ limit: parseInt(limit) }}>
          {({ fetching, data, error }) => {
            if (fetching) {
              return "Loading...";
            } else if (error) {
              return "Error loading coins";
            }

            return (
              <>
                {data.allCoins.map((c) => (
                  <div className="card" key={c.id}>
                    <div className="name">{c.name}</div>
                    <div className="price">{c.price}</div>
                    <div className="symbol">{c.symbol}</div>
                  </div>
                ))}
              </>
            );
          }}
        </Query>
      </div>
    </div>
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
