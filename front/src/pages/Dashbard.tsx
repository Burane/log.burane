import React from 'react';
import { Button, Container, Title } from '@mantine/core';
import { Api } from '../services/api/api';
import { AppCard } from '../components/AppCard';
import { useStore } from '../providers/StoreProvider';

export const Dashboard = ({}) => {
  function getMe() {
    const api = new Api();
    api.getMySelf();
  }

  const { authStore } = useStore();

  useEffect(() => {
    return () => {
      effect;
    };
  });

  return (
    <Container>
      <Title my={30} align="center">
        Dashboard
      </Title>
      <Button onClick={getMe}>get me</Button>
      <AppCard
        total={345.765}
        data={[
          {
            label: 'Mobile',
            count: '204,001',
            part: 59,
            color: '#47d6ab',
          },
          {
            label: 'Desktop',
            count: '121,017',
            part: 35,
            color: '#03141a',
          },
          {
            label: 'Tablet',
            count: '31,118',
            part: 6,
            color: '#4fcdf7',
          },
        ]}
      />
      <AppCard
        total={345.765}
        data={[
          {
            label: 'Mobile',
            count: '204,001',
            part: 59,
            color: '#47d6ab',
          },
          {
            label: 'Desktop',
            count: '121,017',
            part: 35,
            color: '#03141a',
          },
          {
            label: 'Tablet',
            count: '31,118',
            part: 6,
            color: '#4fcdf7',
          },
        ]}
      />
      <AppCard
        total={345.765}
        data={[
          {
            label: 'Mobile',
            count: '204,001',
            part: 59,
            color: '#47d6ab',
          },
          {
            label: 'Desktop',
            count: '121,017',
            part: 35,
            color: '#03141a',
          },
          {
            label: 'Tablet',
            count: '31,118',
            part: 6,
            color: '#4fcdf7',
          },
        ]}
      />
    </Container>
  );
};
