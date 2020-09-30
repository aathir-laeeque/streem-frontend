import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

import { createNewPrototype } from './actions';

export type Props = RouteComponentProps;

export type Author = {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
};

export type PrototypeFormProps = {
  checklistProperties: Property[];
  users: User[];
};

export type SelectedAuthor = { value: string };

export type FormInput = {
  authors: SelectedAuthor[];
  name: string;
  properties: Property[];
};

export type FormOutput = {
  authors: Author[];
  name: string;
  properties: Property[];
};

export enum NewPrototypeActions {
  CREATE_NEW_PROTOTYPE = '@@prototype/CREATE_NEW_PROTOTYPE',
}

export type NewPrototypeActionsType = ReturnType<typeof createNewPrototype>;
