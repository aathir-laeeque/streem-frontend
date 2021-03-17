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
import { setAuthHeader } from '#utils/axiosClient';

export const { store, persistor } = configureStore({});

// persistor.purge();

const App: FC = () => {
  // useEffect(() => {
  //   navigate('/checklist');
  // }, []);

  const onBeforeLift = () => {
    const {
      auth: { accessToken },
    } = store.getState();
    if (accessToken) {
      setAuthHeader(accessToken);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <Router style={{ display: 'flex', flex: 1 }} basepath="/">
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
