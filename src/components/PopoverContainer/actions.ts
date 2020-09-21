import { actionSpreader } from '#store/helpers';
import { PopoverContainerAction } from './types';

export const openPopoverAction = (params: {
  type: string;
  popOverAnchorEl: Element | ((element: Element) => Element);
  props?: Record<string, any>;
}) =>
  actionSpreader(PopoverContainerAction.OPEN_POPOVER, {
    type: params.type,
    popOverAnchorEl: params.popOverAnchorEl,
    props: params.props,
  });

export const closePopoverAction = (params: string) =>
  actionSpreader(PopoverContainerAction.CLOSE_POPOVER, params);

export const closeAllPopoverAction = () =>
  actionSpreader(PopoverContainerAction.CLOSE_ALL_POPOVER);
