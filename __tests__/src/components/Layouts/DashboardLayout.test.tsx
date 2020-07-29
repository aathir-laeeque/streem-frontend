import { DashboardLayout } from '#components/Layouts';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<DashboardLayout />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = <DashboardLayout />;
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
