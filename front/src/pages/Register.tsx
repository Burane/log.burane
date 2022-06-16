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
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';

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
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    const api = new Api();
    let res = await api.register({
      email: values.email,
      username: values.username,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    });
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Account created',
        color: 'green',
        icon: <Check />,
        onClose(props: NotificationProps) {
          navigate('/login');
        },
      });
    } else {
      showNotification({
        title: 'Error !',
        message: res.data.message,
        color: 'red',
        icon: <X />,
      });
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
            placeholder="Your email"
            required
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Username"
            placeholder="Your username"
            required
            {...form.getInputProps('username')}
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
