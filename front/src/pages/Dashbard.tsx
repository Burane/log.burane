import React, { useEffect } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Input,
  Pagination,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { AppCard } from '../components/AppCard';
import { useStore } from '../providers/StoreProvider';
import { observer } from 'mobx-react-lite';
import { Adjustments, AlertCircle, Plus, Search } from 'tabler-icons-react';

export const Dashboard = observer(({}) => {
  const { appStore } = useStore();

  useEffect(() => {
    console.log('use effect dashboard');
    appStore.fetchData();
  }, []);

  const rightSection = (
    <Tooltip
      label="You can search on the application name, description or id"
      position="top"
      placement="end"
    >
      <AlertCircle size={16} style={{ display: 'block', opacity: 0.5 }} />
    </Tooltip>
  );

  return (
    <Container>
      <Title my={20} align="center">
        Dashboard
      </Title>
      <Grid columns={24} justify="center">
        <Grid.Col span={18}>
          <Input
            icon={<Search />}
            radius="lg"
            placeholder="Search an application"
            onChange={(event: { currentTarget: { value: string } }) =>
              appStore.searchApplications(event.currentTarget.value)
            }
            rightSection={rightSection}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Tooltip label="Create an application">
            <ActionIcon color="violet" size="lg" radius="xl" variant="filled">
              <Plus />
            </ActionIcon>
          </Tooltip>
        </Grid.Col>
      </Grid>

      {appStore.applications.map((app) => (
        <AppCard key={app.id} application={app} />
      ))}
      <Center>
        <Pagination
          total={appStore.pagination.pageCount}
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
