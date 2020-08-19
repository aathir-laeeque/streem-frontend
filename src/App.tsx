// alias imports
import { Notification, ModalContainer, CustomRoute } from '#components';
import { configureStore } from '#store';
import { AuthView } from '#views';
// library imports
import { Router } from '@reach/router';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

import GlobalStyles from './styles/GlobalStyles';
import { HomeView } from './views';

const store = configureStore({});

const App: FC = () => {
  // useEffect(() => {
  //   navigate('/checklist');
  // }, []);

  return (
    <Provider store={store}>
      <Router style={{ height: 'inherit', width: 'inherit' }} basepath="/">
        <CustomRoute isProtected={false} as={AuthView} path="auth/*" />
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
      <ModalContainer />
      <GlobalStyles />
    </Provider>
  );
};

export default App;
