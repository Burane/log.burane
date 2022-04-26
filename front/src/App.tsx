import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelloWorld } from './components/HelloWorld';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';
import { Center, Loader } from '@mantine/core';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { Auth } from './components/Auth';
import { observer } from 'mobx-react-lite';
import { Role } from './types';

export const App = observer(({}) => {
  const [rootStore, setRootStore] = useState<RootStoreModel | undefined>(
    undefined,
  );

  useEffect(() => {
    setRootStore(setupRootStore());
  }, []);

  if (!rootStore) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="grape" size="xl" variant="bars" />
      </Center>
    );
  }

  const { userStore, authStore } = rootStore;
  return (
    <StoreProvider value={rootStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HelloWorld />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/reset-password" element={<Login />} />
          <Route
            element={
              <RequireAuth
                isAllowed={
                  authStore.isAuthenticated &&
                  userStore.role === Role.SUPERADMIN
                }
              />
            }
          >
            <Route path="/auth1" element={<Auth />} />
            <Route path="/admin" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
});
