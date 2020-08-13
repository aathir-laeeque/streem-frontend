import { AccountCircle, KeyboardArrowDown } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import NestedMenuItem from '../shared/NestedMenuItem';
import MenuItem from '@material-ui/core/MenuItem';
import React, { FC } from 'react';
import { navigate } from '@reach/router';

import MemoStreemLogo from '#assets/svg/StreemLogo';
import { ImageWrapper } from '../../styles/ImageWrapper';
import { HeaderMenu, Wrapper, MenuText } from './styles';

const Header: FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <ImageWrapper>
        <MemoStreemLogo fontSize={100} />
      </ImageWrapper>
      <HeaderMenu
        aria-controls="top-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircle style={{ color: '#999999' }} />
        <MenuText>Account</MenuText>
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
            navigate('profile');
            handleClose();
          }}
        >
          My Account
        </MenuItem>
        <NestedMenuItem
          left
          label="System Settings"
          mainMenuOpen={anchorEl ? true : false}
        >
          <MenuItem
            onClick={() => {
              navigate('user-access');
              handleClose();
            }}
          >
            User Access
          </MenuItem>
        </NestedMenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </Wrapper>
  );
};

export default Header;
