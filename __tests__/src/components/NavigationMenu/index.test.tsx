import { NavigationMenu } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<NavigationMenu />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = <NavigationMenu />;
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
