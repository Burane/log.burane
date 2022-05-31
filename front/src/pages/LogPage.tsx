import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Center,
  Container,
  Pagination,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { useParams } from 'react-router-dom';
import { LogCard } from '../components/LogCard';

export const LogPage = observer(({}) => {
  const { logStore } = useStore();
  let { appId } = useParams();

  useEffect(() => {
    console.log('id:', appId);
    if (!appId) return;
    logStore.fetchData(appId);
  }, []);

  if (!appId) {
    return (
      <Container>
        <Title my={30} align="center">
          Logs
        </Title>
      </Container>
    );
  } else {
    return (
      <Container>
        <Title my={30} align="center">
          Logs
        </Title>
        <ScrollArea style={{ height: '70vh' }} offsetScrollbars>
          {logStore.logMessages.map((log) => {
            return <LogCard key={log.id} log={log} />;
          })}
        </ScrollArea>

        <Center>
          <Pagination
            total={logStore.pagination.pageCount}
            size="lg"
            radius="lg"
            withEdges
            page={logStore.pagination.pageIndex + 1}
            onChange={(page) => {
              if (appId) logStore.fetchPage(page - 1, appId);
            }}
          />
        </Center>
      </Container>
    );
  }
});
