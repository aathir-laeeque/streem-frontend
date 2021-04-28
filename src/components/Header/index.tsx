import CleenLogo from '#assets/svg/CleenLogo';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { getInitials } from '#utils/stringUtils';
import { logout } from '#views/Auth/actions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardArrowDown } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { capitalize } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ImageWrapper } from '../../styles/ImageWrapper';
import NestedMenuItem from '../shared/NestedMenuItem';
import { HeaderMenu, MenuText, Wrapper } from './styles';

const Header: FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const { profile } = useTypedSelector((state) => state.auth);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <ImageWrapper>
        <CleenLogo fontSize={100} />
      </ImageWrapper>
      <HeaderMenu
        aria-controls="top-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <div className="thumb">
          {getInitials(`${profile?.firstName} ${profile?.lastName}`)}
        </div>
        <MenuText>{`${capitalize(profile?.firstName)} ${capitalize(
          profile?.lastName,
        )}`}</MenuText>
        <KeyboardArrowDown style={{ color: '#1d84ff' }} />
      </HeaderMenu>
      <Menu
        id="top-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ marginTop: 30 }}
      >
        <MenuItem
          onClick={() => {
            navigate('/profile');
            handleClose();
          }}
        >
          My Account
        </MenuItem>
        {checkPermission(['header', 'usersAndAccess']) && (
          <NestedMenuItem
            left
            label="System Settings"
            mainMenuOpen={anchorEl ? true : false}
          >
            <MenuItem
              onClick={() => {
                navigate('/user-access');
                handleClose();
              }}
            >
              Users and Access
            </MenuItem>
          </NestedMenuItem>
        )}
        <MenuItem
          onClick={() => {
            dispatch(logout());
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Wrapper>
  );
};

export default Header;
