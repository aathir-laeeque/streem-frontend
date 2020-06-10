import { Router } from '@reach/router';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

import { Header, NavigationMenu, WorkArea } from './components';

import { DashboardLayout } from './components/Layouts';

import { store } from './store/configureStore';

import GlobalStyles from './styles/GlobalStyles';

import {
  AuditLogsView,
  ChecklistView,
  DashboardView,
  ReportsView,
  TasksView,
} from './views';

const App: FC = () => (
  <Provider store={store}>
    <DashboardLayout>
      <Header />
      <NavigationMenu />
      <WorkArea>
        <Router basepath="/">
          <DashboardView path="/" />
          <AuditLogsView path="audit/*" />
          <ChecklistView path="checklist/*" />
          <ReportsView path="reports/*" />
          <TasksView path="tasks/*" />
        </Router>
      </WorkArea>
    </DashboardLayout>
    <GlobalStyles />
  </Provider>
);

export default App;
