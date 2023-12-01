import { Constraint } from '#types';
import { InputTypes } from './globalTypes';

export const setKeepPersistedData = (value = '') => {
  localStorage.setItem('keepPersistedData', value);
};

export const openLinkInNewTab = (link: string) => {
  setKeepPersistedData('true');
  window.open(link, '_blank');
};

export const labelByConstraint = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
    case InputTypes.TIME:
    case InputTypes.DATE_TIME:
      return {
        [Constraint.LTE]: 'not older than',
        [Constraint.GTE]: 'not later than',
      };
    case InputTypes.SINGLE_LINE:
    case InputTypes.MULTI_LINE:
    case InputTypes.SINGLE_SELECT:
    case InputTypes.MULTI_SELECT:
    case InputTypes.ONE_TO_ONE:
    case InputTypes.ONE_TO_MANY:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
      };
    default:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
        [Constraint.LT]: 'is less than',
        [Constraint.GT]: 'is more than',
        [Constraint.LTE]: 'is less than equal to',
        [Constraint.GTE]: 'is more than equal to',
      };
  }
};
