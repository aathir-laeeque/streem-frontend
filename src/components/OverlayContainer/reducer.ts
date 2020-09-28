import {
  OverlayContainerAction,
  OverlayContainerActionType,
  OverlayContainerState,
} from './types';

const initialState: OverlayContainerState = {
  currentOverlays: [],
};

const reducer = (
  state = initialState,
  action: OverlayContainerActionType,
): OverlayContainerState => {
  switch (action.type) {
    case OverlayContainerAction.OPEN_OVERLAY:
      if (action.payload) {
        return {
          ...state,
          currentOverlays: [...state.currentOverlays, action.payload],
        };
      } else {
        return { ...state };
      }

    case OverlayContainerAction.CLOSE_OVERLAY:
      return {
        ...state,
        currentOverlays: state.currentOverlays.filter(
          (x) => x.type !== action.payload.type,
        ),
      };
    case OverlayContainerAction.CLOSE_ALL_OVERLAY:
      return {
        ...state,
        currentOverlays: [],
      };

    default:
      return { ...state };
  }
};

export { reducer as OverlayContainerReducer };
