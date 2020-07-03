const baseUrl = 'http://api.streem.leucinetech.com/v1';

//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}`;

export const apiExecuteIntearction = (interactionId: number) =>
  `${baseUrl}/interactions/${interactionId}/execute`;

// Job
export const apiGetJobs = () => `${baseUrl}/jobs`;

// Properties
export const apiGetProperties = () => `${baseUrl}/properties`;

//Users
export const apiGetUsers = () => `${baseUrl}/users`;
