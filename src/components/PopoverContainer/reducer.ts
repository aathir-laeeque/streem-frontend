import {
  PopoverContainerAction,
  PopoverContainerActionType,
  PopoverContainerState,
} from './types';

const initialState: PopoverContainerState = {
  currentPopovers: [],
};

const reducer = (
  state = initialState,
  action: PopoverContainerActionType,
): PopoverContainerState => {
  switch (action.type) {
    case PopoverContainerAction.OPEN_POPOVER:
      if (action.payload) {
        return { ...state, currentPopovers: [action.payload] };
      } else {
        return { ...state };
      }

    case PopoverContainerAction.CLOSE_POPOVER:
      return {
        ...state,
        currentPopovers: state.currentPopovers.filter(
          (x) => x.type !== action.payload,
        ),
      };
    case PopoverContainerAction.CLOSE_ALL_POPOVER:
      return {
        ...state,
        currentPopovers: [],
      };

    default:
      return { ...state };
  }
};

export { reducer as PopoverContainerReducer };
