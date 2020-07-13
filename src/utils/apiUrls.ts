import { Task } from '../views/Checklists/ChecklistComposer/TaskList/TaskView/types';
import { Job } from '../views/Jobs/types';

const baseUrl = 'http://api.streem.leucinetech.com/v1';

//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: number) =>
  `${baseUrl}/checklists/${checklistId}`;

// Job
export const apiGetJobs = () => `${baseUrl}/jobs`;

// Properties
export const apiGetProperties = () => `${baseUrl}/properties`;

//Users
export const apiGetUsers = () => `${baseUrl}/users`;

export const apiGetSelectedJob = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}`;

export const apiExecuteActivity = () => `${baseUrl}/activities/execute`;

export const apiCompleteTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}`;
