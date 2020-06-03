/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { actionSpreader } from './../../store/helpers';
import { CounterActionTypes } from './types';

export const increment = () => actionSpreader(CounterActionTypes.INCREMENT);

export const decrement = () => actionSpreader(CounterActionTypes.DECREMENT);

export const reset = () => actionSpreader(CounterActionTypes.RESET);
