import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import { HelloWorld } from './components/HelloWorld';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';
import { Center, Loader } from '@mantine/core';

export const App = ({}) => {
  const [rootStore, setRootStore] = useState<RootStoreModel | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      setRootStore(setupRootStore());
    })();
  }, []);

  if (!rootStore) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="grape" size="xl" variant="bars" />
      </Center>
    );
  }
  return (
    <StoreProvider value={rootStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HelloWorld />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};
