import { Checkbox } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<Checkbox />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = <Checkbox onClick={() => jest.fn()} />;
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
