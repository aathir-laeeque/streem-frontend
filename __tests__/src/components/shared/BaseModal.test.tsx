import { BaseModal } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<BaseModal />', () => {
  let snapshot: ReactTestRenderer;

  const props = {
    closeAllModals: jest.fn(),
    closeModal: jest.fn(),
    onSecondary: jest.fn(),
    title: 'Base Modal Test',
    primaryText: 'Primary',
    secondaryText: 'Cancel',
    onPrimary: jest.fn(),
  };

  beforeAll(() => {
    const component = (
      <BaseModal {...props}>
        <div />
      </BaseModal>
    );
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
