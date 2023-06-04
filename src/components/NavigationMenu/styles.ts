import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  grid-area: nav-menu;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
`;

export const NavItem = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  padding: 12px;
  cursor: pointer;

  > span {
    font-size: 14px;
    line-height: 1.29;
  }

  .secondary-icon {
    margin-left: auto;
    font-size: 18px;
  }
`;
