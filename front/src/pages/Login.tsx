import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useStore } from '../providers/StoreProvider';

export const Login = ({}) => {
  const schema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const { authStore } = useStore();

  type FormValues = typeof form.values;
  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    let res = await authStore.login({
      email: values.email,
      password: values.password,
    });
    console.log(res);
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

        <TextInput
          required
          label="Password"
          {...form.getInputProps('password')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};
