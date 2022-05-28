import React, { useState } from 'react';
import {
  Button,
  Group,
  LoadingOverlay,
  Notification,
  Paper,
  Textarea,
  TextInput,
} from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { useStore } from '../providers/StoreProvider';
import { showNotification } from '@mantine/notifications';
import { Check, Cross, X } from 'tabler-icons-react';

export const CreateApp = ({}) => {
  const [loading, setLoading] = useState(false);
  const { appStore } = useStore();

  const schema = z.object({
    name: z.string(),
    description: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
      description: '',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const res = await appStore.create(values);
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Application created',
        color: 'green',
        icon: <Check />,
      });
    } else {
      showNotification({
        title: 'Error !',
        message: res.data.message,
        color: 'red',
        icon: <X />,
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="lg">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Name"
            placeholder="Application name"
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            mt={10}
            autosize
            minRows={3}
            label="Description"
            placeholder="Application description"
            required
            {...form.getInputProps('description')}
          />
          <Group position="center" mt={40}>
            <Button loading={loading} type="submit">
              Create
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};
