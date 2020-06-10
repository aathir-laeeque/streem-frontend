import { Checklist } from './types';

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateMockData = (): Checklist[] => [
  {
    id: 'a1f242b4-8e07-4e6a-9673-fe369fd2b6a8',
    name: 'Checklist 1',
    version: null,
    archived: false,
    stages: [
      { id: uuid(), name: 'Procure Material', steps: [] },
      { id: uuid(), name: 'Initial Dry Cleaning', steps: [] },
      { id: uuid(), name: 'Initial Wash', steps: [] },
      { id: uuid(), name: 'Dismantling of Parts', steps: [] },
      { id: uuid(), name: 'Wash the Equipment Parts', steps: [] },
      { id: uuid(), name: 'Clean the Inlet Air Duct and Flap', steps: [] },
      { id: uuid(), name: 'Initial Inspection', steps: [] },
    ],
  },
];
