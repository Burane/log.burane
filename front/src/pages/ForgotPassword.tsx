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
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { ArrowLeft, Check, X } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { useStore } from '../providers/StoreProvider';

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

export function ForgotPassword() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { authStore } = useStore();

  const schema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    const res = await authStore.forgotPassword({
      email: values.email,
    });
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'An email with a reset link has been sent',
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
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Your email"
            placeholder="example@burane.fr"
            required
            {...form.getInputProps('email')}
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
