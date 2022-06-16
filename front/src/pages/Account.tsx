import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  Paper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useStore } from '../providers/StoreProvider';
import { At, Check, Edit, User, X } from 'tabler-icons-react';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

export const Account = observer(({}) => {
  const { userStore } = useStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    email: z.string(),
    username: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: userStore.email,
      username: userStore.username,
    },
  });

  type FormValues = typeof form.values;

  async function handleSubmit(values: FormValues) {
    setLoading(true);
    const res = await userStore.modifyAccount({
      userId: userStore.id,
      ...values,
    });
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Account modified !',
        color: 'green',
        icon: <Check />,
      });
      setEditing(false);
    } else {
      showNotification({
        title: 'Error !',
        message: res.data.message,
        color: 'red',
        icon: <X />,
      });
    }
    setLoading(false);
  }

  return (
    <Container>
      <Title my={30} align="center">
        Account
      </Title>
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
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          {!editing ? (
            <Tooltip label="Edit" sx={{ position: 'absolute', right: '1vw' }}>
              <Button
                variant="subtle"
                radius="xl"
                onClick={() => setEditing(true)}
              >
                <Edit />
              </Button>
            </Tooltip>
          ) : (
            <Group spacing="xs" sx={{ position: 'absolute', right: '1vw' }}>
              <Tooltip label="Cancel">
                <Button
                  variant="subtle"
                  radius="xl"
                  onClick={() => {
                    form.reset();
                    setEditing(false);
                  }}
                >
                  <X />
                </Button>
              </Tooltip>
              <Tooltip label="Confirm">
                <Button variant="subtle" radius="xl" type="submit">
                  <Check />
                </Button>
              </Tooltip>
            </Group>
          )}

          <Text align="center" size="xl" weight={700} my="md">
            {userStore.username}
          </Text>
          <Avatar src={null} size={120} radius={120} mx="auto" mb="xl" />
          <Input
            icon={<At size={16} />}
            placeholder="Your email"
            disabled={!editing}
            my="md"
            {...form.getInputProps('email')}
          />
          <Input
            icon={<User size={16} />}
            placeholder="Your username"
            disabled={!editing}
            my="md"
            {...form.getInputProps('username')}
          />
        </form>
      </Paper>
    </Container>
  );
});
