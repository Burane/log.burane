import React from 'react';
import { observer } from 'mobx-react-lite';
import { Api } from '../services/api/api';
import { Box, Button } from '@mantine/core';

export const GetMe = observer(({}) => {
  //button that make a request to the server
  const getMe = async () => {
    //make a request to the server
    //get the response
    //set the state
    const api = new Api();
    const res = await api.getMySelf();
    console.log('res', res);
  };

  return (
    <Box>
      <Button onClick={getMe}>Get me</Button>
    </Box>
  );
});
