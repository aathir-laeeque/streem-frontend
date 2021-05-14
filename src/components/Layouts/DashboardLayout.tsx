import React, { FC } from 'react';
import styled from 'styled-components';

const Layout = styled.div.attrs({
  className: 'main-layout-view',
})`
  display: grid;
  grid-template-areas:
    'header header'
    'nav-menu workarea';
  grid-template-rows: 50px 1fr;
  grid-template-columns: 120px 1fr;
  flex: 1;
  background-color: #fafafa;

  @media (max-width: 1200px) {
    grid-template-columns: 100px 1fr;
  }
`;

const DashboardLayout: FC = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default DashboardLayout;
