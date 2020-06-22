const baseUrl = 'http://api.streem.leucinetech.com/v1';

//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: string) =>
  `${baseUrl}/checklist/${checklistId}`;

export const apiExecuteIntearction = (interactionId: number) =>
  `${baseUrl}/interactions/${interactionId}/execute`;

// Task
export const apiGetTasks = () => `${baseUrl}/taks`;

// Properties
export const apiGetProperties = () => `${baseUrl}/properties`;
