import {
  ModalContainerAction,
  ModalContainerActionType,
  ModalContainerState,
} from './types';

const initialState: ModalContainerState = {
  currentModals: [],
};

const reducer = (
  state = initialState,
  action: ModalContainerActionType,
): ModalContainerState => {
  switch (action.type) {
    case ModalContainerAction.OPEN_MODAL:
      if (action.payload) {
        return { ...state, currentModals: [action.payload] };
      } else {
        return { ...state };
      }

    case ModalContainerAction.CLOSE_MODAL:
      return {
        ...state,
        currentModals: state.currentModals.filter(
          (x) => x.type !== action.payload,
        ),
      };
    case ModalContainerAction.CLOSE_ALL_MODAL:
      return {
        ...state,
        currentModals: [],
      };

    default:
      return { ...state };
  }
};

export { reducer as ModalContainerReducer };
