import React from 'react';
import { Button, Container, Title } from '@mantine/core';
import { Api } from '../services/api/api';

export const Dashboard = ({}) => {
  function getMe() {
    const api = new Api();
    api.getMySelf();
  }

  return (
    <Container>
      <Title my={30} align="center">
        Dashboard
      </Title>
      <Button onClick={getMe}>get me</Button>
    </Container>
  );
};
