import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from './types';

/**
 * This function takes the action dispatched from the component and send to the redux store to perform state update
 * @param type Name of hte action that has to be performed by redux
 * @param payload Payload data that has to be modified in the store
 */

// function overload for actions without any payload
export function actionSpreader<T extends string>(type: T): { type: T };
// function overload for actions with payload
export function actionSpreader<T extends string, P extends any>(
  type: T,
  payload: P,
): { type: T; payload: P };
// actual actionSpreader function with payload as optional
export function actionSpreader<T extends string, P extends any>(
  type: T,
  payload?: P,
) {
  return { type, payload } as any;
}

/**
 * Typed selector for redux store as per the application state defined in the root reducer
 */
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
