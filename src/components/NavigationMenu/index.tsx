import {
  PeopleOutline,
  DescriptionOutlined,
  MailOutline,
  AccountTreeOutlined,
} from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC } from 'react';
import checkPermission from '#services/uiPermissions';
import { Menu, Wrapper, NavItem } from './styles';
import { MenuItem } from './types';
import { useTypedSelector } from '#store';
import { ALL_FACILITY_ID } from '#utils/constants';

export const navigationOptions = {
  inbox: { name: 'Inbox', icon: MailOutline },
  jobs: { name: 'Jobs', icon: PeopleOutline },
  checklists: { name: 'Processes', icon: DescriptionOutlined },
  ontology: { name: 'Ontology', icon: AccountTreeOutlined },
};

const NavigationMenu: FC = () => {
  const { selectedFacility: { id: facilityId = '' } = {} } = useTypedSelector(
    (state) => state.auth,
  );
  const menuItems: MenuItem[] = [];
  Object.entries(navigationOptions).forEach(([key, value]) => {
    if (checkPermission([facilityId === ALL_FACILITY_ID ? 'globalSidebar' : 'sidebar', key])) {
      menuItems.push({ ...value, path: `/${key}` });
    }
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
                  color: isActive ? '#ffffff' : '#161616',
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
