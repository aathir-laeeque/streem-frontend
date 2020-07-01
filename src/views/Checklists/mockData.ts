import { ChecklistsObj, Checklist } from './types';
import { default as checklistsData } from './checklists.json';

// const uuid = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0,
//       v = c == 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// };

const generateChecklists = (): ChecklistsObj => checklistsData;

export const checklists = generateChecklists();

export const getChecklist = (id: string | number): Checklist | undefined =>
  checklists.data.find((el) => el.id === id);
