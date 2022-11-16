import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  grid-area: nav-menu;
`;

export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
`;

export const NavItem = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;

  > span {
    font-size: 14px;
    line-height: 1.29;
  }
`;
