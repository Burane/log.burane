import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { HelloWorld } from './components/HelloWorld';
import { useStore } from './providers/StoreProvider';
import { Login } from './pages/Login';

export const App = ({}) => {
  const { userStore } = useStore();

  useEffect(() => {
    userStore.getUser();
  }, []);

  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<HelloWorld />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MantineProvider>
  );
};
