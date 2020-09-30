import { UserStatus } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

type TabContentProps = {
  selectedStatus: UserStatus;
};
export type ListViewProps = RouteComponentProps;
export type TabViewProps = RouteComponentProps & TabContentProps;
