import { Checklist } from '../checklist.types';
import { TasksById, TaskOrderInStage } from './reducer.types';

export const getTasks = (checklist: Checklist | Partial<Checklist>) => {
  const listById: TasksById = {},
    tasksOrderInStage: TaskOrderInStage = {};

  checklist?.stages?.map((stage) => {
    tasksOrderInStage[stage.id.toString()] = [];

    stage?.tasks?.map((task) => {
      tasksOrderInStage[stage.id.toString()].push(task.id);

      listById[task.id.toString()] = { ...task, errors: [] };
    });
  });

  return { listById, tasksOrderInStage };
};
