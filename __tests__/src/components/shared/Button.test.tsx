import { Button, FlatButton } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<Button />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = (
      <div>
        <Button onClick={() => jest.fn()}>Button</Button>
        <FlatButton onClick={() => jest.fn()}>FlatButton</FlatButton>
      </div>
    );
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
