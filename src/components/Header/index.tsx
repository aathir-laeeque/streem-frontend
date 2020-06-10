import { AccountCircle, KeyboardArrowDown } from '@material-ui/icons';
import React, { FC } from 'react';

import Logo from '../../assets/images/streem-logo.svg';
import { ImageWrapper } from '../../styles/ImageWrapper';
import { HeaderMenu, Wrapper, MenuText } from './styles';

const Header: FC = () => {
  return (
    <Wrapper>
      <ImageWrapper>
        <img src={Logo} />
      </ImageWrapper>
      <HeaderMenu>
        <AccountCircle style={{ color: '#999999' }} />
        <MenuText>Account</MenuText>
        <KeyboardArrowDown style={{ color: '#12aab3' }} />
      </HeaderMenu>
    </Wrapper>
  );
};

export default Header;
