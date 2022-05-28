import React from 'react';
import {
  Box,
  createStyles,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { DeviceAnalytics } from 'tabler-icons-react';
import { ApplicationSnapshotType } from '../stores/application/application.model';

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

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

export const AppCard = ({
  application,
}: {
  application: ApplicationSnapshotType;
}) => {
  const { classes } = useStyles();

  const segments = application.logMessagesCount.map((segment) => ({
    value: segment._count,
    color: '#47d6ab',
    label: segment.level,
  }));

  const descriptions = application.logMessagesCount.map((stat) => (
    <Box
      key={stat.level}
      sx={{ borderBottomColor: '#47d6ab' }}
      className={classes.stat}
    >
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.level}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700}>{stat._count}</Text>
        <Text
          color={'#47d6ab'}
          weight={700}
          size="sm"
          className={classes.statCount}
        >
          {(stat._count / application._count.logMessages) * 100}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Group align="flex-end" spacing="xs">
          <Text size="xl" weight={700}>
            {application.name}
          </Text>
        </Group>
        <DeviceAnalytics size={20} className={classes.icon} />
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
