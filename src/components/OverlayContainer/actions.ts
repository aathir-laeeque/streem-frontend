import { actionSpreader } from '#store/helpers';
import { OverlayContainerAction, Overlay } from './types';

export const openOverlayAction = (params: Overlay) =>
  actionSpreader(OverlayContainerAction.OPEN_OVERLAY, {
    type: params.type,
    props: params.props,
    popOverAnchorEl: params.popOverAnchorEl,
  });

export const closeOverlayAction = (params: string) =>
  actionSpreader(OverlayContainerAction.CLOSE_OVERLAY, { type: params });

export const closeAllOverlayAction = () =>
  actionSpreader(OverlayContainerAction.CLOSE_ALL_OVERLAY);
