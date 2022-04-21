import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from './stores';
import { StoreProvider } from './providers/StoreProvider';
import { App } from './components/App';
import dotenv from 'dotenv'

dotenv.config()

const rootStore = createStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
