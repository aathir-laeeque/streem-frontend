import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #fafafa;
  flex: 1;
  grid-area: nav-menu;
  padding-top: 15px;
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
  padding: 12px 0;
`;
