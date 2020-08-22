import { RouteComponentProps } from '@reach/router';

export type ViewUserProps = RouteComponentProps;

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
