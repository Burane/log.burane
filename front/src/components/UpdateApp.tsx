import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Button,
  Group,
  Paper,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { useStore } from '../providers/StoreProvider';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Check, Copy, Refresh, X } from 'tabler-icons-react';
import { ApplicationSnapshotType } from '../stores/application/application.model';
import { observer } from 'mobx-react-lite';
import { useClipboard } from '@mantine/hooks';

export const UpdateApp = observer(
  ({
    setDrawerState,
    application,
  }: {
    setDrawerState: Dispatch<SetStateAction<boolean>>;
    application: ApplicationSnapshotType;
  }) => {
    const [loading, setLoading] = useState(false);
    const { appStore } = useStore();
    const clipboard = useClipboard({ timeout: 200 });

    const schema = z.object({
      name: z.string(),
      description: z.string(),
      pushUrl: z.string(),
      discordWebhookUrl: z.nullable(z.string()),
    });

    const webhookUrl = (token?: string | null) => {
      if (token && token.length !== 0)
        return `${import.meta.env.VITE_API_URL}/logs/create/${token}`;
      else return '';
    };

    const form = useForm({
      schema: zodResolver(schema),
      initialValues: {
        name: application.name,
        description: application.description,
        pushUrl: webhookUrl(application.webhookToken),
        discordWebhookUrl: application.discordWebhookUrl
          ? application.discordWebhookUrl
          : '',
      },
    });

    const generateWebhook = async () => {
      const res = await appStore.generateWebhook({ appId: application.id });
      if (res.ok) {
        form.setFieldValue('pushUrl', webhookUrl(res.data.webhookToken));
      }
    };

    type FormValues = typeof form.values;

    const handleSubmit = async (values: FormValues) => {
      setLoading(true);
      const proxyValues = new Proxy(values, {
        get: (obj, prop: keyof typeof values) =>
          obj[prop] === '' ? null : obj[prop],
      });
      // if (values.discordWebhookUrl === '') values.discordWebhookUrl = null;
      const res = await appStore.update({
        appId: application.id,
        ...proxyValues,
      });
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
            <TextInput
              label="Push url"
              placeholder="Push url"
              {...form.getInputProps('pushUrl')}
              disabled
              sx={{ cursor: 'pointer' }}
              rightSectionWidth={70}
              rightSection={
                <Group spacing="xs" noWrap>
                  <Tooltip label="Copy to clipboard">
                    <Copy
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        clipboard.copy(form.values.pushUrl);
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Generate new push url">
                    <Refresh
                      style={{ cursor: 'pointer' }}
                      onClick={() => generateWebhook()}
                    />
                  </Tooltip>
                </Group>
              }
            />
            <TextInput
              label="Discord webhook url"
              placeholder="Discord webhook url"
              {...form.getInputProps('discordWebhookUrl')}
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
  },
);
