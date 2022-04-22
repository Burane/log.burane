import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { HelloWorld } from './components/HelloWorld';
import { useStore } from './providers/StoreProvider';

export const App = ({}) => {
  const { userStore } = useStore();

  useEffect(() => {
    userStore.getUser();
  }, []);

  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<HelloWorld />} />
      </Routes>
    </MantineProvider>
  );
};
