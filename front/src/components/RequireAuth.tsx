import React from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, Navigate } from 'react-router-dom';

export const RequireAuth = observer(
  ({
    children,
    isAllowed,
    redirectPath = '/login',
  }: {
    children?: JSX.Element;
    isAllowed: boolean;
    redirectPath?: string;
  }) => {
    if (!isAllowed) return <Navigate to={redirectPath} replace />;

    return children ? children : <Outlet />;
  },
);
