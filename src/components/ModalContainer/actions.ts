import { actionSpreader } from '#store/helpers';
import { ModalContainerAction } from './types';

export const openModalAction = (params: {
  type: string;
  props?: Record<string, any>;
}) =>
  actionSpreader(ModalContainerAction.OPEN_MODAL, {
    type: params.type,
    props: params.props,
  });

export const closeModalAction = (params: string) =>
  actionSpreader(ModalContainerAction.CLOSE_MODAL, params);

export const closeAllModalAction = () =>
  actionSpreader(ModalContainerAction.CLOSE_ALL_MODAL);
