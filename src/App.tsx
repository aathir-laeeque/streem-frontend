// alias imports
import { Notification, OverlayContainer, CustomRoute } from '#components';
import { configureStore } from '#store';
import { AuthView } from '#views';
// library imports
import { Router } from '@reach/router';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import GlobalStyles from './styles/GlobalStyles';
import { HomeView } from './views';
import PrintJob from '#views/Jobs/PrintJob';
import PrintSessionActivity from '#views/UserAccess/PrintSessionActivity';
import PrintJobActivity from '#views/Jobs/PrintJobActivity';

export const { store, persistor } = configureStore({});

// persistor.purge();

const App: FC = () => {
  // useEffect(() => {
  //   navigate('/checklist');
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router style={{ height: 'inherit', width: 'inherit' }} basepath="/">
          <CustomRoute isProtected={false} as={AuthView} path="auth/*" />
          <CustomRoute as={PrintJob} path="jobs/print/:jobId" />
          <CustomRoute as={PrintSessionActivity} path="users-activity/print" />
          <CustomRoute as={PrintJobActivity} path="job-activity/print/:jobId" />
          <CustomRoute as={HomeView} path="/*" />
        </Router>
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
        <OverlayContainer />
        <GlobalStyles />
      </PersistGate>
    </Provider>
  );
};

export default App;
