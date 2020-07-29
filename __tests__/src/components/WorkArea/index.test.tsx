import { WorkArea } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<WorkArea />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = <WorkArea />;
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
