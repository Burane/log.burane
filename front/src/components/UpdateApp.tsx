import React, { Dispatch, SetStateAction, useState } from 'react';
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
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Check, Cross, X } from 'tabler-icons-react';
import { ApplicationSnapshotType } from '../stores/application/application.model';

export const UpdateApp = ({
  setDrawerState,
  application,
}: {
  setDrawerState: Dispatch<SetStateAction<boolean>>;
  application: ApplicationSnapshotType;
}) => {
  const [loading, setLoading] = useState(false);
  const { appStore } = useStore();

  const schema = z.object({
    name: z.string(),
    description: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: application.name,
      description: application.description,
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const res = await appStore.update({ appId: application.id, ...values });
    if (res.ok) {
      showNotification({
        title: 'Success !',
        message: 'Application updated',
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
          <Group position="center" mt={40}>
            <Button loading={loading} type="submit">
              Update
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};
