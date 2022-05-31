import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Text, Title } from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { useParams } from 'react-router-dom';

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
  }

  return (
    <Container>
      <Title my={30} align="center">
        Logs
      </Title>

      {logStore.logMessages.map((log) => {
        return <Text>{log.message}</Text>;
      })}
    </Container>
  );
});
