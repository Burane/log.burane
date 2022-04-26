import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelloWorld } from './components/HelloWorld';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';
import { Center, Loader } from '@mantine/core';
import { RequireAuth } from './components/RequireAuth';
import { Auth } from './components/Auth';
import { observer } from 'mobx-react-lite';
import { Role } from './types';
import { ForgotPassword } from './pages/ForgotPassword';
import { Layout } from './components/Layout';
import { PageNotFound } from './pages/PageNotFound';

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
          <Route element={<Layout />}>
            <Route path="/" element={<HelloWorld />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<Login />} />
          <Route
            element={<RequireAuth isAllowed={authStore.isAuthenticated} />}
          >
            <Route path="/dashboard" element={<Auth />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
});
