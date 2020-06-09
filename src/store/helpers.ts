import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { BaseAction, RootState } from './types';

/**
 * This function takes the action dispatched from the component and send to the redux store to perform state update
 * @param type Name of hte action that has to be performed by redux
 * @param payload Payload data that has to be modified in the store
 */
export const actionSpreader = <T extends string, P extends any>(
  type: T,
  payload?: P,
): BaseAction<T, P> => ({ type, payload });

/**
 * Typed selector for redux store as per the application state defined in the root reducer
 */
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
