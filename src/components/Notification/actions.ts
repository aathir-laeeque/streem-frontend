import { SvgIconComponent } from '@material-ui/icons';
import { actionSpreader } from './../../store/helpers';
import { NotificationActions, NotificationType } from './types';

export const showNotification = (payload: {
  type: NotificationType;
  msg: string;
  delayTime?: number;
  detail?: string;
  icon?: SvgIconComponent;
  iconProps?: Record<string, any>;
}) => actionSpreader(NotificationActions.SHOW_NOTIFICATION, payload);
