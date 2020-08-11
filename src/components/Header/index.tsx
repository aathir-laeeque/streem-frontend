import { AccountCircle, KeyboardArrowDown } from '@material-ui/icons';
import React, { FC } from 'react';
import { navigate } from '@reach/router';

import MemoStreemLogo from '../../assets/svg/StreemLogo';
import { ImageWrapper } from '../../styles/ImageWrapper';
import { HeaderMenu, Wrapper, MenuText } from './styles';

const Header: FC = () => {
  return (
    <Wrapper>
      <ImageWrapper>
        <MemoStreemLogo fontSize={110} />
      </ImageWrapper>
      <HeaderMenu onClick={() => navigate('user-access')}>
        <AccountCircle style={{ color: '#999999' }} />
        <MenuText>Account</MenuText>
        <KeyboardArrowDown style={{ color: '#1d84ff' }} />
      </HeaderMenu>
    </Wrapper>
  );
};

export default Header;
