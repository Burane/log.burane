import React, { useState } from 'react';
import {
  AppShell,
  Center,
  createStyles,
  Group,
  Navbar,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  CalendarStats,
  DeviceDesktopAnalytics,
  Fingerprint,
  Gauge,
  Home2,
  Icon as TablerIcon,
  Logout,
  Settings,
  SwitchHorizontal,
  User,
} from 'tabler-icons-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../providers/StoreProvider';

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7],
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;

  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" withArrow transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: Home2, label: 'Home' },
  { icon: Gauge, label: 'Dashboard' },
  { icon: DeviceDesktopAnalytics, label: 'Analytics' },
  { icon: CalendarStats, label: 'Releases' },
  { icon: User, label: 'Account' },
  { icon: Fingerprint, label: 'Security' },
  { icon: Settings, label: 'Settings' },
];

export const Layout = () => {
  const [active, setActive] = useState(2);
  const theme = useMantineTheme();
  const { authStore } = useStore();
  const navigate = useNavigate();

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  const CustomNavBar = () => {
    return (
      <Navbar width={{ base: 80 }} p="md">
        <Center>{/*<MantineLogoSmall />*/}</Center>
        <Navbar.Section grow mt={50}>
          <Group direction="column" align="center" spacing={0}>
            {links}
          </Group>
        </Navbar.Section>
        <Navbar.Section>
          <Group direction="column" align="center" spacing={0}>
            <NavbarLink icon={SwitchHorizontal} label="Change account" />
            <NavbarLink
              icon={Logout}
              label="Logout"
              onClick={async () => {
                console.log('logout');
                await authStore.logout();
                navigate('/login');
              }}
            />
          </Group>
        </Navbar.Section>
      </Navbar>
    );
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbar={<CustomNavBar />}
    >
      <Outlet />
    </AppShell>
  );
};
