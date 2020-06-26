const baseUrl = 'http://api.streem.leucinetech.com/v1';

//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;
export const apiGetChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}`;

// Task
export const apiGetTasks = () => `${baseUrl}/tasks`;

//Properties
export const apiGetProperties = () => `${baseUrl}/properties`;
