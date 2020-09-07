import { AccountCircle, KeyboardArrowDown } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import { getInitials } from '#utils/stringUtils';
import NestedMenuItem from '../shared/NestedMenuItem';
import { useTypedSelector } from '#store';
import MenuItem from '@material-ui/core/MenuItem';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { logOut } from '#views/Auth/actions';

import MemoStreemLogo from '#assets/svg/StreemLogo';
import { ImageWrapper } from '../../styles/ImageWrapper';
import { HeaderMenu, Wrapper, MenuText } from './styles';

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
        <MemoStreemLogo fontSize={100} />
      </ImageWrapper>
      <HeaderMenu
        aria-controls="top-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {/* <AccountCircle style={{ color: '#999999' }} /> */}
        <div className="thumb">
          {getInitials(`${profile?.firstName} ${profile?.lastName}`)}
        </div>
        <MenuText>{`${profile?.firstName} ${profile?.lastName}`}</MenuText>
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
        <MenuItem
          onClick={() => {
            dispatch(logOut());
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
