import { Facilities } from '#store/facilities/types';
import { User } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

import { RoleType } from '../types';
import { Toggleables } from './helpers';

export enum PAGE_TYPE {
  EDIT = 'edit',
  ADD = 'add',
  PROFILE = 'profile',
}

export type ViewUserProps = RouteComponentProps<{
  id?: User['id'];
}> & { pageType: PAGE_TYPE };

export type EditUserProps = RouteComponentProps & {
  user: User;
  facilities: Facilities;
  rolePlaceholder: string;
  isAccountOwner: boolean;
  isEditable: boolean;
  selectedRoles: RoleType[];
  pageType: PAGE_TYPE;
};

export type EditUserRequestInputs = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string | null;
  department: string;
  roles: string;
  facilities?: { id: string }[];
  username?: string;
  password?: string;
  confirmPassword?: string;
};

export type TogglesState = {
  [Toggleables.EDIT_PASSWORD]: boolean;
  [Toggleables.EDIT_QUESTIONS]: boolean;
};
