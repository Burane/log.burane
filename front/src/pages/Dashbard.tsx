import React, { useEffect } from 'react';
import { Button, Container, Title } from '@mantine/core';
import { Api } from '../services/api/api';
import { AppCard } from '../components/AppCard';
import { useStore } from '../providers/StoreProvider';
import { observer } from 'mobx-react-lite';

export const Dashboard = observer(({}) => {
  function getMe() {
    const api = new Api();
    api.getMySelf();
  }

  const { appStore } = useStore();

  useEffect(() => {
    appStore.fetchData();
  }, []);

  return (
    <Container>
      <Title my={30} align="center">
        Dashboard
      </Title>
      <Button onClick={getMe}>get me</Button>
      {appStore.applications.map((app) => (
        <AppCard key={app.id} application={app} />
      ))}
    </Container>
  );
});
