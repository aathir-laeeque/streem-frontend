import { TasksObj, Task } from './types';
import { default as tasksData } from './tasks.json';

const generateTasks = (): TasksObj => tasksData;

export const tasks = generateTasks();

export const getTask = (id: string | number): Task | undefined =>
  tasks.data.find((el) => el.id === id);
