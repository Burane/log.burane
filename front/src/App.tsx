import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { HelloWorld } from './components/HelloWorld';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';

export const App = ({}) => {
  const [rootStore, setRootStore] = useState<RootStoreModel | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      setRootStore(setupRootStore());
    })();
  }, []);

  // const { userStore } = useStore();
  //
  // useEffect(() => {
  //   userStore.getUser();
  // }, []);

  if (!rootStore) {
    return <div>Loading...</div>;
  }
  return (
    <StoreProvider value={rootStore}>
      <BrowserRouter>
        <MantineProvider>
          <Routes>
            <Route path="/" element={<HelloWorld />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </MantineProvider>
      </BrowserRouter>
    </StoreProvider>
  );
};
