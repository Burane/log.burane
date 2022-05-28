import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Container,
  Paper,
  Text,
  Modal,
  Title,
} from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { Edit } from 'tabler-icons-react';
import { observer } from 'mobx-react-lite';
import { ModifyAccount } from '../components/ModifyAccount';

export const Account = observer(({}) => {
  const { userStore } = useStore();
  const [opened, setOpened] = useState(false);

  return (
    <Container>
      <Title my={30} align="center">
        Account
      </Title>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Modify your account"
      >
        <ModifyAccount />
      </Modal>
      <Paper
        style={{ position: 'relative' }}
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Button
          variant="subtle"
          radius="xl"
          style={{ position: 'absolute', right: '1vw' }}
          onClick={() => setOpened(true)}
        >
          <Edit />
        </Button>
        <Avatar src={null} size={120} radius={120} mx="auto" />
        <Text align="center" size="lg" weight={500} mt="md">
          {userStore.email}
        </Text>
        <Text align="center" color="dimmed" size="sm">
          {userStore.role}
        </Text>
      </Paper>
    </Container>
  );
});
