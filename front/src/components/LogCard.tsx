import React from 'react';
import { Badge, Group, Paper, Text } from '@mantine/core';
import { LogLevel } from '../stores/application/application.model';
import { LogMessageSnapshotType } from '../stores/log/log.model';

export const LogCard = ({ log }: { log: LogMessageSnapshotType }) => {
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

  return (
    <Paper withBorder p="md" radius="lg" my={20}>
      <Group position="apart">
        <Group>
          <Text size="sm">{log.date}</Text>
        </Group>
        <Group>
          <Text size="lg">{log.message}</Text>
        </Group>
        <Group>
          <Badge
            sx={() => ({
              backgroundColor: getColorForLogLevel(log.level),
              width: '70px',
            })}
          >
            <Text size="xs" color="white">
              {log.level}
            </Text>
          </Badge>
        </Group>
      </Group>
    </Paper>
  );
};
