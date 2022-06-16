import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Center,
  Container,
  Input,
  Pagination,
  ScrollArea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { useParams } from 'react-router-dom';
import { LogCard } from '../components/LogCard';
import { AlertCircle, Search } from 'tabler-icons-react';
import { defaultPaginationQuery } from '../stores/log/log.store';

export const LogPage = observer(({}) => {
  const { logStore } = useStore();
  let { appId } = useParams();

  useEffect(() => {
    if (!appId) return;
    logStore.fetchData(appId, defaultPaginationQuery);
  }, []);

  const rightSection = (
    <Tooltip
      label="You can search on the log message or the log level"
      position="top"
      placement="end"
    >
      <AlertCircle size={16} style={{ display: 'block', opacity: 0.5 }} />
    </Tooltip>
  );

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
        <Input
          icon={<Search />}
          radius="lg"
          placeholder="Search in logs"
          onChange={(event: { currentTarget: { value: string } }) => {
            if (appId) logStore.searchLogs(event.currentTarget.value, appId);
          }}
          rightSection={rightSection}
        />
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
            mt={30}
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
