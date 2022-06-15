import React from 'react';
import {
  AppShell,
  Avatar,
  Center,
  createStyles,
  Group,
  Navbar,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  Fingerprint,
  Gauge,
  Icon,
  Logout,
  Moon,
  Sun,
  User,
} from 'tabler-icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../providers/StoreProvider';

const useStyles = createStyles((theme) => {
  return {
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
          theme.colors[theme.primaryColor][
            theme.colorScheme === 'dark' ? 4 : 7
          ],
      },
    },
  };
});

interface NavbarLinkProps {
  icon: Icon;
  label: string;
  active?: boolean;

  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip
      label={label}
      position="right"
      placement="center"
      withArrow
      transitionDuration={0}
      withinPortal={false}
    >
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon />
      </UnstyledButton>
    </Tooltip>
  );
}

const navBarLinks: { icon: Icon; label: string; navigate: string }[] = [
  { icon: Gauge, label: 'Dashboard', navigate: '/dashboard' },
  // { icon: DeviceDesktopAnalytics, label: 'Analytics', navigate: '/dashboard' },
  // { icon: CalendarStats, label: 'Releases', navigate: '/dashboard' },
  { icon: User, label: 'Account', navigate: '/account' },
  // { icon: Fingerprint, label: 'Security', navigate: '/security' },
  // { icon: Settings, label: 'Settings', navigate: '/dashboard' },
];

export const Layout = () => {
  const theme = useMantineTheme();
  const { authStore } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const light = colorScheme === 'light';

  const links = navBarLinks.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={pathname === link.navigate}
      onClick={() => {
        navigate(link.navigate);
      }}
    />
    // <Button onClick={() => navigate(link.navigate)}></Button>
  ));

  const CustomNavBar = () => {
    return (
      <Navbar width={{ base: 90 }} p="md">
        <Center>{<Avatar radius="xl" />}</Center>
        <Navbar.Section grow mt={50}>
          <Group direction="column" align="center" spacing={0}>
            {links}
          </Group>
        </Navbar.Section>
        <Navbar.Section>
          <Group direction="column" align="center" spacing={0}>
            <NavbarLink
              icon={!light ? Sun : Moon}
              onClick={() => toggleColorScheme()}
              label="colorsheme"
            />
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
      fixed
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
