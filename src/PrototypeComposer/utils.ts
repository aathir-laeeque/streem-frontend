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
      } else if (error.code in TaskErrors) {
        acc.tasksErrors.push(error);
      } else if (error.code in StageErrors) {
        acc.stagesErrors.push(error);
      } else {
        acc.otherErrors.push(error);
      }

      return acc;
    },
    { stagesErrors: [], tasksErrors: [], parametersErrors: [], otherErrors: [] },
  );
