import React, { useEffect } from 'react';
import { Center, Container, Pagination, Title } from '@mantine/core';
import { AppCard } from '../components/AppCard';
import { useStore } from '../providers/StoreProvider';
import { observer } from 'mobx-react-lite';

export const Dashboard = observer(({}) => {
  const { appStore } = useStore();

  useEffect(() => {
    appStore.fetchData();
  }, []);

  return (
    <Container>
      <Title my={30} align="center">
        Dashboard
      </Title>
      {appStore.applications.map((app) => (
        <AppCard key={app.id} application={app} />
      ))}
      <Center>
        <Pagination
          total={appStore.pagination.pageCount}
          color="violet"
          size="lg"
          radius="lg"
          withEdges
          page={appStore.pagination.pageIndex + 1}
          onChange={(page) => {
            appStore.fetchPage(page - 1);
          }}
        />
      </Center>
    </Container>
  );
});
