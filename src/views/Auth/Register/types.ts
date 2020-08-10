import { RouteComponentProps } from '@reach/router';

export type RegisterProps = RouteComponentProps<{
  name: string;
  email: string;
}>;
