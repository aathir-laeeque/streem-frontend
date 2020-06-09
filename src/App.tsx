import { Router } from '@reach/router';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

import { Header, NavigationMenu } from './components';

import { DashboardLayout, WorkAreaLayout } from './components/Layouts';

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
      <WorkAreaLayout>
        <Router basepath="/">
          <DashboardView path="/" />
          <AuditLogsView path="audit/*" />
          <ChecklistView path="checklist/*" />
          <ReportsView path="reports/*" />
          <TasksView path="tasks/*" />
        </Router>
      </WorkAreaLayout>
    </DashboardLayout>
    <GlobalStyles />
  </Provider>
);

export default App;
