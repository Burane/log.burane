import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { z } from 'zod';
import { useStore } from '../providers/StoreProvider';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export const Login = observer(({}) => {
  const navigate = useNavigate();

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
    <Container size={420} my={40}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor<'a'>
            href="#"
            size="sm"
            onClick={(event) => event.preventDefault()}
          >
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group position="apart" mt="md">
            <Anchor<'a'> onClick={() => navigate('/forgotPassword')} size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
});