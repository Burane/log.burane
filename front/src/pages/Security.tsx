import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Title } from '@mantine/core';

export const Security = observer(({}) => {
  return (
    <Container>
      <Title my={30} align="center">
        Security
      </Title>
    </Container>
  );
});
