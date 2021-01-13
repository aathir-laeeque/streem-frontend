import { UserState } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

type TabContentProps = {
  selectedState: UserState;
};
export type ListViewProps = RouteComponentProps;
export type TabViewProps = RouteComponentProps;
