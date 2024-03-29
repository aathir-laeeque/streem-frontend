import Nunito200 from '#assets/fonts/nunito/nunito-v14-latin-200.ttf';
import Nunito300 from '#assets/fonts/nunito/nunito-v14-latin-300.ttf';
import Nunito600 from '#assets/fonts/nunito/nunito-v14-latin-600.ttf';
import Nunito700 from '#assets/fonts/nunito/nunito-v14-latin-700.ttf';
import Nunito800 from '#assets/fonts/nunito/nunito-v14-latin-800.ttf';
import Nunito900 from '#assets/fonts/nunito/nunito-v14-latin-900.ttf';
import Nunito400 from '#assets/fonts/nunito/nunito-v14-latin-regular.ttf';
import { CustomRoute, Notification, OpenFileUrl, OverlayContainer } from '#components';
import { MultiTabChecker } from '#components/OverlayContainer/MultiTabChecker';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import '#i18n';
import { configureStore } from '#store';
import { setAuthHeader } from '#utils/axiosClient';
import { AuthView, FacilitySelectionView, HomeView, UseCaseSelectionView } from '#views';
import { SsoView } from '#views/Auth/SsoView';
import PrintJob from '#views/Jobs/PrintJob';
import PrintJobAuditLogs from '#views/Jobs/PrintJobAuditLogs';
import PrintJobLogs from '#views/Jobs/PrintJobLogs';
import PrintObjectChangeLogs from '#views/Ontology/PrintObjectChangeLogs/index';
import PrintSessionActivity from '#views/UserAccess/PrintSessionActivity';
import { Router } from '@reach/router';
import { Font } from '@react-pdf/renderer';
import { enableMapSet } from 'immer';
import React, { FC, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppVersionCheck } from './AppVersionCheck';
import { MsalComponent } from './MsalComponent';
import GlobalStyles from './styles/GlobalStyles';

Font.register({
  family: 'Nunito',
  fonts: [
    { src: Nunito400 },
    { src: Nunito200, fontWeight: 200 },
    { src: Nunito300, fontWeight: 300 },
    { src: Nunito600, fontWeight: 600 },
    { src: Nunito700, fontWeight: 700 },
    { src: Nunito800, fontWeight: 800 },
    { src: Nunito900, fontWeight: 900 },
  ],
});

enableMapSet();

const { store, persistor } = configureStore({});
window.store = store;
window.persistor = persistor;

type Orientation = 'landscape' | 'portrait';

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const onBeforeLift = () => {
    const {
      auth: { accessToken },
    } = store.getState();
    if (accessToken) {
      setAuthHeader(accessToken);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const dispatch = store.dispatch as typeof store.dispatch;

  (() => {
    const getOrientation = (): Orientation => {
      if (window.screen.orientation) {
        const screenOrientation = window.screen.orientation.type;
        if (
          screenOrientation.startsWith('landscape') ||
          screenOrientation === 'landscape-primary'
        ) {
          return 'landscape';
        } else if (
          screenOrientation.startsWith('portrait') ||
          screenOrientation === 'portrait-primary'
        ) {
          return 'portrait';
        }
      }
      // Fallback for browsers that don't support screen.orientation API
      return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
    };

    const [orientation, setOrientation] = useState<Orientation>(getOrientation());

    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    useEffect(() => {
      window.addEventListener('orientationchange', handleOrientationChange);
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }, []);

    if (orientation === 'portrait') {
      dispatch(
        openOverlayAction({
          type: OverlayNames.ORIENTATION_MODAL,
        }),
      );
    }
  })();

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
            {!isLoading && (
              <>
                <MultiTabChecker />
                <Router style={{ display: 'flex', flex: 1 }} basepath="/">
                  <CustomRoute isProtected={false} as={AuthView} path="auth/*" />
                  <CustomRoute isProtected={false} as={SsoView} path="sso/auth" />
                  <CustomRoute as={FacilitySelectionView} path="facility/selection" />
                  <CustomRoute as={HomeView} path="home" />
                  <CustomRoute as={PrintJob} path="jobs/:jobId/print" />
                  <CustomRoute as={PrintSessionActivity} path="users-activity/print" />
                  <CustomRoute as={PrintJobAuditLogs} path="job-activity/:jobId/print" />
                  <CustomRoute as={PrintJobLogs} path="job-logs/:viewId/print" />
                  <CustomRoute as={OpenFileUrl} path="jobs/:jobId/fileUpload/print" />
                  <CustomRoute
                    as={PrintObjectChangeLogs}
                    path="object-change-logs/:objectId/print"
                  />
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
              </>
            )}
          </PersistGate>
        </Provider>
      </MsalComponent>
    </AppVersionCheck>
  );
};

export default App;
