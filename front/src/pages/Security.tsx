import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Paper, Text, Title } from '@mantine/core';
import { useStore } from '../providers/StoreProvider';

export const Security = observer(({}) => {
  const {
    userStore: { email },
  } = useStore();
  return (
    <Container>
      <Title my={30} align="center">
        Security
      </Title>

      <Paper px={5} withBorder>
        <Text>Change your email</Text>
        <Text>{email}</Text>
      </Paper>
    </Container>
  );
});
