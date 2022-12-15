import { AppVersionCheck } from './AppVersionCheck';
import { CustomRoute, Notification, OverlayContainer } from '#components';
import '#i18n';
import { configureStore } from '#store';
import { setAuthHeader } from '#utils/axiosClient';
import { AuthView, FacilitySelectionView, HomeView, UseCaseSelectionView } from '#views';
import PrintJob from '#views/Jobs/PrintJob';
import PrintJobAuditLogs from '#views/Jobs/PrintJobAuditLogs';
import JobSummaryPdf from '#views/Jobs/SummaryPdf/index';
import PrintSessionActivity from '#views/UserAccess/PrintSessionActivity';
import { Router } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import GlobalStyles from './styles/GlobalStyles';
import { MsalComponent } from './MsalComponent';

export const { store, persistor } = configureStore({});

const App: FC = () => {
  const onBeforeLift = () => {
    const {
      auth: { accessToken },
    } = store.getState();
    if (accessToken) {
      setAuthHeader(accessToken);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://js-eu1.hs-scripts.com/25337116.js';

    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AppVersionCheck>
      <MsalComponent>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor} onBeforeLift={onBeforeLift}>
            <Router style={{ display: 'flex', flex: 1 }} basepath="/">
              <CustomRoute isProtected={false} as={AuthView} path="auth/*" />
              <CustomRoute as={FacilitySelectionView} path="facility/selection" />
              <CustomRoute as={HomeView} path="home" />
              <CustomRoute as={PrintJob} path="jobs/:jobId/print" />
              <CustomRoute as={JobSummaryPdf} path="jobs/:jobId/summary/print" />
              <CustomRoute as={PrintSessionActivity} path="users-activity/print" />
              <CustomRoute as={PrintJobAuditLogs} path="job-activity/:jobId/print" />
              <CustomRoute as={UseCaseSelectionView} path="/*" />
            </Router>
            <Notification
              position="top-right"
              autoClose={5000}
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
      </MsalComponent>
    </AppVersionCheck>
  );
};

export default App;
