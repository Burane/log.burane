import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { z } from 'zod';
import { useStore } from '../providers/StoreProvider';
import { observer } from 'mobx-react-lite';
import { GetMe } from '../components/GetMe';

export const Login = observer(({}) => {
  const schema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: 'superadmin@test.com',
      password: '123456',
    },
  });

  const { authStore, userStore } = useStore();

  type FormValues = typeof form.values;
  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    let res = await authStore.login({
      email: values.email,
      password: values.password,
    });
    console.log(res);
    console.log(userStore);
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          required
          label="Password"
          {...form.getInputProps('password')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <Text>userStore: {JSON.stringify(userStore)}</Text>
      <Text>authStore: {JSON.stringify(authStore)}</Text>
      <GetMe />
    </Box>
  );
});
