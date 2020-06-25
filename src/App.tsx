// alias imports
import { Header, NavigationMenu, WorkArea } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { store } from '#store';

// library imports
import { navigate, Router } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';

// relative imports
import GlobalStyles from './styles/GlobalStyles';
import {
  AuditLogsView,
  ChecklistView,
  DashboardView,
  ReportsView,
  TasksView,
} from './views';

const App: FC = () => {
  // useEffect(() => {
  //   navigate('/checklist');
  // }, []);

  return (
    <Provider store={store}>
      <DashboardLayout>
        <Header />
        <NavigationMenu />
        <WorkArea>
          <Router basepath="/">
            <DashboardView path="/" />
            <AuditLogsView path="audit/*" />
            <ChecklistView path="checklists/*" />
            <ReportsView path="reports/*" />
            <TasksView path="tasks/*" />
          </Router>
        </WorkArea>
      </DashboardLayout>
      <GlobalStyles />
    </Provider>
  );
};

export default App;
