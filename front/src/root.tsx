import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MantineProvider } from '@mantine/core';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';

// const StoreProvider = ({ children }: { children: JSX.Element }) => {
//   const [rootStore, setRootStore] = useState<RootStoreModel | undefined>(
//     undefined,
//   );
//
//   useEffect(() => {
//     setRootStore(setupRootStore());
//   }, []);
//
//   return <StoreProvider value={rootStore}>{children}</StoreProvider>;
// };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
