import { Properties } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

let snapshot: ReactTestRenderer;

const props: {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedChecklist: Checklist;
  properties: Properties;
  onCreateJob: () => void;
} = {
  closeAllModals: jest.fn(),
  closeModal: jest.fn(),
  selectedChecklist: {
    code: '123',
    id: 1,
    name: 'Test Checklist',
    version: 1,
    properties: {
      test_property: 'Test Property',
    },
  },
  properties: [
    {
      id: 1,
      name: 'test_property',
      placeHolder: 'Test Placeholder',
      orderTree: 1,
      mandatory: true,
    },
    {
      id: 2,
      name: 'test_property2',
      placeHolder: 'Test Placeholder 2',
      orderTree: 2,
      mandatory: false,
    },
  ],
  onCreateJob: jest.fn(),
};

beforeAll(() => {
  const modal = <CreateJobModal {...props} />;
  snapshot = create(modal);
});

describe('<CreateJobModal />', () => {
  it('it matches the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  it('should have a checklistId', () => {
    render(<CreateJobModal {...props} />);
    const inputNode = screen.getByTestId('checklistId');
    expect(inputNode).toBeTruthy();
    expect(inputNode).toHaveProperty(
      'value',
      `${props.selectedChecklist.code} ${props.selectedChecklist.name}`,
    );
  });

  it.each(props.properties)(
    'Properties Rendered For : $property.name',
    (property) => {
      render(<CreateJobModal {...props} />);
      expect(screen.getByTestId(property.name)).toBeTruthy();
    },
  );
});
