import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';
import { Center, Loader } from '@mantine/core';
import { RequireAuth } from './components/RequireAuth';
import { observer } from 'mobx-react-lite';
import { ForgotPassword } from './pages/ForgotPassword';
import { Layout } from './components/Layout';
import { PageNotFound } from './pages/PageNotFound';
import { ResetPassword } from './pages/ResetPassword';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Security } from './pages/Security';
import { Dashboard } from './pages/Dashbard';

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
          {/* non auth exclusive routes */}
          <Route
            element={
              <RequireAuth
                isAllowed={!authStore.isAuthenticated}
                redirectPath="/dashboard"
              />
            }
          >
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </Route>

          {/* no restriction routes */}
          <Route path="/resetPassword" element={<ResetPassword />} />

          {/* auth exclusive routes */}
          <Route
            element={<RequireAuth isAllowed={authStore.isAuthenticated} />}
          >
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/security" element={<Security />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
});
