import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from './stores';
import { StoreProvider } from './providers/StoreProvider';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';

const rootStore = createStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
