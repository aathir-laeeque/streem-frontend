import { actionSpreader } from '#store/helpers';
import { OverlayContainerAction } from './types';

export const openOverlayAction = (params: {
  type: string;
  props: Record<string, any>;
  popOverAnchorEl?: Element | ((element: Element) => Element);
}) =>
  actionSpreader(OverlayContainerAction.OPEN_OVERLAY, {
    type: params.type,
    props: params.props,
    popOverAnchorEl: params.popOverAnchorEl,
  });

export const closeOverlayAction = (params: string) =>
  actionSpreader(OverlayContainerAction.CLOSE_OVERLAY, params);

export const closeAllOverlayAction = () =>
  actionSpreader(OverlayContainerAction.CLOSE_ALL_OVERLAY);
