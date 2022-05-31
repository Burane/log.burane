import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Paper, Text, Title } from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { ApplicationSnapshotType } from '../stores/application/application.model';

export const LogPage = observer(
  ({ application }: { application: ApplicationSnapshotType }) => {
    useEffect(() => {
      return () => {};
    }, []);

    return (
      <Container>
        <Title my={30} align="center">
          Logs
        </Title>
      </Container>
    );
  },
);
