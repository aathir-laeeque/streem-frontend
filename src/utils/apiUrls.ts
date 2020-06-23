const baseUrl = 'http://api.streem.leucinetech.com/v1';

export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: number) =>
  `${baseUrl}/checklists/${checklistId}`;

export const apiGetProperties = () => `${baseUrl}/properties`;
