const baseUrl = 'http://api.streem.leucinetech.com/v1';

//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;
export const apiGetChecklist = (checklistId: string) =>
  `${baseUrl}/checklist/${checklistId}`;

// Task
export const apiGetTasks = () => `${baseUrl}/tasks`;
export const apiCreateTask = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}/tasks`;

//Properties
export const apiGetProperties = () => `${baseUrl}/properties`;
