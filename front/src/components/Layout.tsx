import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout = ({}) => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
};
