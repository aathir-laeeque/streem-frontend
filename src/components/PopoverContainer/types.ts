import {
  openPopoverAction,
  closePopoverAction,
  closeAllPopoverAction,
} from './actions';

export enum PopoverNames {
  TASK_USER_ASSIGNMENT = 'TASK_USER_ASSIGNMENT',
}

export interface Popover {
  type: string;
  popOverAnchorEl: Element | ((element: Element) => Element);
  props?: Record<string, any>;
}

export interface PopoverContainerProps {
  currentPopovers: Popover[];
  closePopover: () => void;
  closeAllPopovers: () => void;
}

export enum PopoverContainerAction {
  OPEN_POPOVER = '@@popover/Container/OPEN_POPOVER',
  CLOSE_POPOVER = '@@popover/Container/CLOSE_POPOVER',
  CLOSE_ALL_POPOVER = '@@popover/Container/CLOSE_ALL_POPOVER',
}

export interface PopoverContainerState {
  readonly currentPopovers: Popover[];
}

export type PopoverContainerActionType = ReturnType<
  | typeof openPopoverAction
  | typeof closePopoverAction
  | typeof closeAllPopoverAction
>;
