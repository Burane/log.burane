import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HelloWorld = ({}) => {
  const navigate = useNavigate();

  return <div onClick={() => navigate('/login')}>hello world</div>;
};
