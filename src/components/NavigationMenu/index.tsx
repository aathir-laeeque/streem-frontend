import {
  Assessment,
  Dashboard,
  FeaturedPlayList,
  LibraryAddCheck,
  MenuBook,
} from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC } from 'react';

import { Menu, Wrapper, NavItem } from './styles';
import { MenuItem } from './types';

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: Dashboard, path: '/' },
  { name: 'Jobs', icon: FeaturedPlayList, path: '/jobs' },
  { name: 'Checklists', icon: LibraryAddCheck, path: '/checklists' },
  { name: 'Reports', icon: Assessment, path: '/reports' },
  { name: 'Audit Logs', icon: MenuBook, path: '/audit' },
];

const NavigationMenu: FC = () => (
  <Wrapper>
    <Menu>
      {menuItems.map(({ path, name, icon: Icon }, index) => (
        <Link
          to={path}
          key={`${name}-${index}`}
          getProps={({ location: { pathname } }) => {
            const isActive = pathname.split('/')[1] === path.split('/')[1];

            return {
              style: {
                color: isActive ? '#ffffff' : '#808080',
                backgroundColor: isActive ? '#12aab3' : 'transparent',
                textDecoration: 'none',
              },
            };
          }}
        >
          <NavItem>
            <Icon size="24" />
            <span>{name}</span>
          </NavItem>
        </Link>
      ))}
    </Menu>
  </Wrapper>
);

export default NavigationMenu;
