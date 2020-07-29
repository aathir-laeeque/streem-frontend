import { configureStore } from '#store';
import SideBar from '#views/Checklists/ListView/SideBar';
import { SideBarProps } from '#views/Checklists/ListView/SideBar/types';
import React from 'react';
import { Provider } from 'react-redux';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { Store } from 'redux';

import { checklists, jobsProperties } from '#mocks';

describe('<SideBar />', () => {
  let store: Store;
  let snapshot: ReactTestRenderer;
  const props: SideBarProps = {
    sideBarOpen: true,
    selectedChecklist: checklists.data[0],
    closeNav: jest.fn(),
    properties: jobsProperties.data,
  };

  beforeAll(() => {
    store = configureStore({});
    const modal = (
      <Provider store={store}>
        <SideBar {...props} />
      </Provider>
    );
    snapshot = create(modal);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
