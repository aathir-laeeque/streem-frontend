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
// import { parseMarkUp } from '#utils/stringUtils';

export const { store, persistor } = configureStore({});
// persistor.purge();

const App: FC = () => {
  // useEffect(() => {
  //   navigate('/checklist');
  // }, []);

  // const node = document.createElement('div');

  // node.innerHTML = `<p>This is a linelajsbdkjasljdhkajshdkjablskjdbaksbdkajsdjahkjdhajsdhkajsdkjaskjdbkajsbdkaskjd</p>
  // <p>aljsdkjah<strong>sjdkhasd</strong></p>
  // <p><strong>I am her</strong></p>
  // <p></p>
  // <p><strong><ins>I am a line</ins></strong></p>
  // <p></p>
  // <ul>
  // <li><strong><ins>item 1</ins></strong></li>
  // <li><strong><ins>item 2</ins></strong></li>
  // </ul>
  // <p></p>
  // <ol>
  // <li><strong><ins>item 1</ins></strong></li>
  // <li><strong><ins>ietm 1</ins></strong></li>
  // <li>Item 123</li>
  // </ol>`;

  // console.log(parseMarkUp(node));

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
