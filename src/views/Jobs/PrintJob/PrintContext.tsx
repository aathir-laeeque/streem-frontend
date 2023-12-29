import { createContext } from 'react';

const INITIAL_VALUE = {
  timeFormat: 'HH:mm:ss',
  dateFormat: 'MMM dd, yyyy',
  dateAndTimeStampFormat: `MMM dd, yyyy HH:mm:ss`,
  selectedFacility: {},
  profile: {},
};

export const PrintContext = createContext<
  typeof INITIAL_VALUE & {
    extra?: any;
  }
>(INITIAL_VALUE);
