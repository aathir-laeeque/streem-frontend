// alias imports
import {
  Header,
  NavigationMenu,
  WorkArea,
  Notification,
  ModalContainer,
} from '#components';
import { DashboardLayout } from '#components/Layouts';
import { store } from '#store';

// library imports
import { Router } from '@reach/router';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

// relative imports
import GlobalStyles from './styles/GlobalStyles';
import {
  AuditLogsView,
  ChecklistView,
  DashboardView,
  ReportsView,
  JobsView,
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
            <JobsView path="jobs/*" />
          </Router>
        </WorkArea>
        <Notification
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ModalContainer />
      </DashboardLayout>
      <GlobalStyles />
    </Provider>
  );
};

export default App;
