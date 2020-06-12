const baseUrl = 'http://api.streem.leucinetech.com/api/v1/';

export const apiGetChecklists = () => `${baseUrl}checklist`;

export const apiGetChecklist = (checklistId: string) =>
  `${baseUrl}checklist/${checklistId}`;
