import { Header } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<Header />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = <Header />;
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
