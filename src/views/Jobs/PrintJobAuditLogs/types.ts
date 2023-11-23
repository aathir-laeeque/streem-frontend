import { PartialUser } from '#types';
import { RouteComponentProps } from '@reach/router';

export type PrintJobAuditLogProps = RouteComponentProps<{
  jobId: string;
}>;

export type Field = {
  field: string;
  values: string[];
  op: string;
  names: {
    [key: string]: PartialUser;
  };
};
