import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Group, Paper, Textarea, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { useStore } from '../providers/StoreProvider';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';

export const CreateApp = ({
  setDrawerState,
}: {
  setDrawerState: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { appStore } = useStore();

  const schema = z.object({
    name: z.string(),
    description: z.string(),
    discordWebhookUrl: z.nullable(z.string()),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
      description: '',
      discordWebhookUrl: '',
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const proxyValues = new Proxy(values, {
      get: (obj, prop: keyof typeof values) =>
        obj[prop] === '' ? null : obj[prop],
    });
    console.log(proxyValues);
    const res = await appStore.create(proxyValues);
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Application created',
        color: 'green',
        icon: <Check />,
        onClose(props: NotificationProps) {
          setDrawerState(false);
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
          <TextInput
            label="Discord webhook url"
            placeholder="Discord webhook url"
            {...form.getInputProps('discordWebhookUrl')}
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
