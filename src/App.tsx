import React, { FC } from 'react';
import { Provider } from 'react-redux';

import Counter from './components/Counter';
import { configureStore } from './store/configureStore';

const App: FC = () => {
  const store = configureStore({}); // passing empty object as app state

  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

export default App;
