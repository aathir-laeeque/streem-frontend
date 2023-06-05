import { SvgIconProps } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import { actionSpreader } from './../../store/helpers';
import { NotificationActions, NotificationType } from './types';

export const showNotification = (payload: {
  type: NotificationType;
  msg: string | JSX.Element;
  delayTime?: number;
  detail?: string;
  icon?: SvgIconComponent;
  iconProps?: SvgIconProps;
}) => actionSpreader(NotificationActions.SHOW_NOTIFICATION, payload);
