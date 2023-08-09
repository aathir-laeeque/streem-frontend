import { createContext } from 'react';

const INITIAL_VALUE = {
  timeFormat: 'HH:mm',
  dateFormat: 'MMM dd, yyyy',
  dateAndTimeStampFormat: `MMM dd, yyyy HH:mm`,
};

export const PrintContext = createContext<
  typeof INITIAL_VALUE & {
    extra?: any;
  }
>(INITIAL_VALUE);
