import { Error } from '#utils/globalTypes';

import { ParameterErrors } from './Activity/types';
import { StageErrors } from './Stages/types';
import { TaskErrors } from './Tasks/types';
import { ErrorGroups } from './types';

// TODO CHECK ERROR CODES
export const groupErrors = (errors: Error[]) =>
  errors.reduce<ErrorGroups>(
    (acc, error) => {
      if (error.code in ParameterErrors) {
        acc.parametersErrors.push(error);
        acc.errorsWithEntity.push({
          ...error,
          entity: 'parameter',
        });
      } else if (error.code in TaskErrors) {
        acc.tasksErrors.push(error);
        acc.errorsWithEntity.push({
          ...error,
          entity: 'task',
        });
      } else if (error.code in StageErrors) {
        acc.stagesErrors.push(error);
        acc.errorsWithEntity.push({
          ...error,
          entity: 'stage',
        });
      } else {
        acc.otherErrors.push(error);
        acc.errorsWithEntity.push(error);
      }

      return acc;
    },
    {
      stagesErrors: [],
      tasksErrors: [],
      parametersErrors: [],
      otherErrors: [],
      errorsWithEntity: [],
    },
  );
