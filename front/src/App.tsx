import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { StoreProvider } from './providers/StoreProvider';
import { RootStoreModel } from './stores/root.store';
import { setupRootStore } from './stores/store.persistence';
import {
  Center,
  ColorScheme,
  ColorSchemeProvider,
  Loader,
  MantineProvider,
} from '@mantine/core';
import { RequireAuth } from './components/RequireAuth';
import { observer } from 'mobx-react-lite';
import { ForgotPassword } from './pages/ForgotPassword';
import { Layout } from './components/Layout';
import { PageNotFound } from './pages/PageNotFound';
import { ResetPassword } from './pages/ResetPassword';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Dashboard } from './pages/Dashbard';
import { useLocalStorage } from '@mantine/hooks';
import { Api } from './services/api/api';
import { NotificationsProvider } from '@mantine/notifications';
import { LogPage } from './pages/LogPage';
import { Result } from './services/api/api.types';
import { UserSnapshot } from './stores/user/user.store';

export const App = observer(({}) => {
  const [rootStore, setRootStore] = useState<RootStoreModel | undefined>(
    undefined,
  );
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  const [isReady, setIsReady] = useState(false);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setRootStore(setupRootStore());
  }, []);

  useEffect(() => {
    (async () => {
      if (rootStore) {
        const authApi = new Api();

        const refreshResult: Result<UserSnapshot> =
          await authApi.refreshToken();

        if (refreshResult.ok) {
          const user = refreshResult.data;
          rootStore.userStore.saveUser(user);
        }

        if (!refreshResult.ok) {
          rootStore.reset();
        }
        setIsReady(true);
      }
    })();
  }, [rootStore]);

  useEffect(() => {
    (async () => {
      if (isReady && rootStore?.authStore?.isAuthenticated) {
        await rootStore.fetchAllStore();
      }
    })();
  }, [isReady]);

  if (!rootStore || !isReady) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="grape" size="xl" variant="bars" />
      </Center>
    );
  }

  const { authStore } = rootStore;
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          primaryColor: 'violet',
          defaultRadius: 'lg',
          colors: {
            DEBUG: ['#2E8BC0'],
            INFO: ['#a9d171'],
            WARN: ['#ff9f40'],
            ERROR: ['#d63727'],
            FATAL: ['#800080'],
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider autoClose={2500}>
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
                  element={
                    <RequireAuth isAllowed={authStore.isAuthenticated} />
                  }
                >
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/logs/:appId" element={<LogPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </StoreProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
});
