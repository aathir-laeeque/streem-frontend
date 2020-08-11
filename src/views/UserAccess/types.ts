import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import { Pageable } from '#utils/globalTypes';

export type UserAccessProps = RouteComponentProps;

export interface UserAccessState {
  readonly list: User[] | undefined;
  readonly pageable: Pageable | undefined | null;
  readonly loading: boolean;
  readonly error: any;
}
