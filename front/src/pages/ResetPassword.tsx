import React from 'react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Title,
} from '@mantine/core';
import { ArrowLeft, Check, X } from 'tabler-icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { Api } from '../services/api/api';
import { NotificationProps, showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

export function ResetPassword() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const schema = z.object({
    password: z.string(),
    passwordConfirmation: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    if (!token) return;
    const api = new Api();
    const res = await api.resetPassword({
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
      token,
    });
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Password has been changed',
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
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Reset your password
      </Title>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Password confirmation"
            placeholder="Confirm your new password"
            required
            mt="md"
            {...form.getInputProps('passwordConfirmation')}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor color="dimmed" size="sm" className={classes.control}>
              <Center inline onClick={() => navigate('/login')}>
                <ArrowLeft size={12} />
                <Box ml={5}>Back to login page</Box>
              </Center>
            </Anchor>
            <Button type="submit" className={classes.control}>
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
