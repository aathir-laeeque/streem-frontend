import { Checklist } from './types';
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateChecklists = (): Checklist[] => [
  {
    id: 'a1f242b4-8e07-4e6a-9673-fe369fd2b6a8',
    name: 'checklist 1',
  },
  {
    id: uuid(),
    name: 'checklist 2',
  },
];

export const checklists = generateChecklists();

export const getChecklist = (id: string | number): Checklist | undefined =>
  checklists.find((el) => el.id === id);
