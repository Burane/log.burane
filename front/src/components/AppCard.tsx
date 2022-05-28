import React, { useState } from 'react';
import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
  Popover,
  Button,
  Center,
} from '@mantine/core';
import { DeviceAnalytics, Settings, Trash } from 'tabler-icons-react';
import {
  ApplicationSnapshotType,
  LogLevel,
} from '../stores/application/application.model';

const useStyles = createStyles((theme) => ({
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: '3px solid',
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: 'flex',
    alignItems: 'center',
  },
}));

export const AppCard = ({
  application,
}: {
  application: ApplicationSnapshotType;
}) => {
  const { classes } = useStyles();
  const [deletePopoverOpened, setDeletePopoverOpened] = useState(false);

  function getColorForLogLevel(logLevel: LogLevel | string) {
    switch (logLevel) {
      case 'DEBUG':
        return '#2E8BC0';
      case 'INFO':
        return '#a9d171';
      case 'WARN':
        return '#ff9f40';
      case 'ERROR':
        return '#d63727';
      case 'FATAL':
        return '#800080';
      default:
        return '#808080';
    }
  }

  const segments = application.logMessagesCount.map((segment) => ({
    value: (segment._count / application._count.logMessages) * 100,
    color: getColorForLogLevel(segment.level),
    label: segment.level,
  }));

  const descriptions = application.logMessagesCount.map((stat) => (
    <Box
      key={stat.level}
      sx={{ borderBottomColor: getColorForLogLevel(stat.level) }}
      className={classes.stat}
    >
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.level}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700} color={getColorForLogLevel(stat.level)}>
          {stat._count}
        </Text>
        <Text
          color={getColorForLogLevel(stat.level)}
          weight={700}
          size="sm"
          className={classes.statCount}
        >
          {((stat._count / application._count.logMessages) * 100).toFixed(2)}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Paper withBorder p="md" radius="lg" my={20}>
      <Group position="apart">
        <Group align="flex-end" spacing="xs">
          <Text size="xl" weight={700}>
            {application.name}
          </Text>
        </Group>
        <Group>
          <Settings size={20} />
          <Popover
            withArrow
            radius="lg"
            opened={deletePopoverOpened}
            position="bottom"
            closeOnEscape={true}
            onClose={() => setDeletePopoverOpened(false)}
            title={
              <Text align="center" weight={700}>
                Delete application
              </Text>
            }
            width={300}
            target={
              <ActionIcon
                color="red"
                variant="transparent"
                onClick={() => setDeletePopoverOpened((b) => !b)}
              >
                <Trash size={20} />
              </ActionIcon>
            }
          >
            <Text>This action is irreversible</Text>
            <Group position="center" mt={30}>
              <Button
                variant="outline"
                onClick={() => setDeletePopoverOpened(false)}
              >
                Cancel
              </Button>
              <Button color="red">Delete</Button>
            </Group>
          </Popover>
        </Group>
      </Group>

      <Text color="dimmed" size="sm">
        {application.description}
      </Text>

      <Text size="xl" weight={700} mt={20}>
        {application._count.logMessages} logs
      </Text>

      <Progress
        sections={segments}
        size={34}
        classNames={{ label: classes.progressLabel }}
        mt={20}
      />
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
        {descriptions}
      </SimpleGrid>
    </Paper>
  );
};
