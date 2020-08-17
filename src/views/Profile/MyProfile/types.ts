import { RouteComponentProps } from '@reach/router';

type TabContentProps = Record<string, any>;
export type MyProfileProps = RouteComponentProps<TabContentProps>;

export type PermissionType = {
  id: number;
  name: string;
  permissions: string[];
};

export type RoleType = {
  id: number;
  name: string;
  permissions: Record<string, boolean>;
};
