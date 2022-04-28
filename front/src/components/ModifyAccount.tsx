import React from 'react';
import { Avatar, Paper } from '@mantine/core';
import { useStore } from '../providers/StoreProvider';

export const ModifyAccount = ({}) => {
  const {
    userStore: { email, role },
  } = useStore();

  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Avatar src={null} size={120} radius={120} mx="auto" />
    </Paper>
  );
};
