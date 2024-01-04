import { TaskExecutionState } from '../PrototypeComposer/checklist.types';
import { ParameterExecutionState } from '../types/parameter';

export const taskStateColor = (taskStatus: TaskExecutionState | ParameterExecutionState) => {
  switch (taskStatus) {
    case 'NOT_STARTED':
      return '#E0E0E0';
    case 'IN_PROGRESS':
      return '#79B6FF';
    case 'COMPLETED':
      return '#24A148';
    case 'COMPLETED_WITH_EXCEPTION':
      return '#F1C21B';
    case 'EXECUTED':
      return '#24A148';
    case 'BEING_EXECUTED':
      return '#79B6FF';
    case 'PENDING_FOR_APPROVAL':
      return '#F1C21B';
    default:
      break;
  }
};

export const taskStateText = (taskStatus: TaskExecutionState | ParameterExecutionState) => {
  switch (taskStatus) {
    case 'NOT_STARTED':
      return 'Task Not Started';
    case 'IN_PROGRESS':
      return 'Task In Progress';
    case 'COMPLETED':
      return 'Task Completed';
    case 'COMPLETED_WITH_EXCEPTION':
      return 'Task Completed with an exception';
    case 'EXECUTED':
      return 'Task Executed';
    case 'BEING_EXECUTED':
      return 'Task Being Executed';
    case 'PENDING_FOR_APPROVAL':
      return 'Task Pending for Approval';
    default:
      return '';
  }
};
