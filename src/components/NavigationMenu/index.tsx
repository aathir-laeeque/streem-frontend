import { FeaturedPlayList, LibraryAddCheck, Inbox } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC } from 'react';
import checkPermission from '#services/uiPermissions';

import { Menu, Wrapper, NavItem } from './styles';
import { MenuItem } from './types';

const NavigationMenu: FC = () => {
  const menuItems: MenuItem[] = [];
  if (checkPermission(['sidebar', 'inbox']))
    menuItems.push({ name: 'Inbox', icon: Inbox, path: '/inbox' });
  if (checkPermission(['sidebar', 'jobs']))
    menuItems.push({ name: 'Jobs', icon: FeaturedPlayList, path: '/jobs' });
  if (checkPermission(['sidebar', 'checklists']))
    menuItems.push({
      name: 'Checklists',
      icon: LibraryAddCheck,
      path: '/checklists',
    });

  return (
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
                  backgroundColor: isActive ? '#1d84ff' : 'transparent',
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
};

export default NavigationMenu;
