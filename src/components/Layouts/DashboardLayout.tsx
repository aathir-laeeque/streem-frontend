import React, { FC } from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  display: grid;
  grid-template-areas:
    'header header header'
    'nav-menu workarea workarea';
  grid-template-rows: auto 1fr;
  grid-template-columns: 120px 1fr;
  height: inherit;
  width: inherit;
`;

const DashboardLayout: FC = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default DashboardLayout;
