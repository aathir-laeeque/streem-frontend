import { configureStore } from '#store';
import ListView from '#views/Checklists/ListView';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import { Store } from 'redux';

describe('<CheckListsListView />', () => {
  let store: Store;
  beforeAll(() => {
    store = configureStore({});
  });

  it('should render and match the snapshot', () => {
    render(
      <Provider store={store}>
        <Router>
          <ListView path="/" />
        </Router>
      </Provider>,
    );
    expect(screen).toMatchSnapshot();
  });
});
