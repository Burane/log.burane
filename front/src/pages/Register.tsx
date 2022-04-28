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
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Api } from '../services/api/api';

export const Register = observer(({}) => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string(),
    passwordConfirmation: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: 'superadmin@test.com',
      password: 'Test1234',
      passwordConfirmation: 'Test1234',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    const api = new Api();
    let res = await api.register({
      email: values.email,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    });
    if (res.kind === 'ok') {
      navigate('/login');
    }
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
          Welcome !
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account ?{' '}
          <Anchor<'a'> size="sm" onClick={() => navigate('/login')}>
            Login
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
          <PasswordInput
            label="Password confirmation"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps('passwordConfirmation')}
          />
          <Group position="apart" mt="md">
            <Anchor<'a'> onClick={() => navigate('/forgotPassword')} size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
});
