import { FloatInput } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<FloatInput />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = (
      <FloatInput
        placeHolder="FloatInput test"
        label="FloatInput Test"
        value=""
        id="FloatInputTestId"
        onChange={() => jest.fn()}
        required
        disabled
      />
    );
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
