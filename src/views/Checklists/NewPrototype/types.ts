import { Checklist } from '#PrototypeComposer/checklist.types';
import { User } from '#services/users';
import { Property } from '#store/properties/types';

import { addNewPrototype, updatePrototype } from './actions';

export enum NewPrototypeActions {
  ADD_NEW_PROTOTYPE = '@@prototype/ADD_NEW_PROTOTYPE',
  ADD_REVISION_PROTOTYPE = '@@prototype/ADD_REVISION_PROTOTYPE',
  UPDATE_PROTOTYPE = '@@prototype/UPDATE_PROTOTYPE',
}

export enum AuthorState {
  IN_PROGRESS = 'IN_PROGRESS',
}

export type NewPrototypeActionsType = ReturnType<
  typeof addNewPrototype | typeof updatePrototype
>;

export type PrototypeProperties = Pick<
  Property,
  'id' | 'name' | 'placeHolder' | 'mandatory'
> & {
  value: string;
};

export type Author = Pick<
  User,
  'id' | 'employeeId' | 'firstName' | 'lastName' | 'email'
> & {
  primary: boolean;
  state: AuthorState;
};

export enum FormMode {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

export type FormValues = {
  authors: Author['id'][];
  description: string;
  name: string;
  primaryAuthor: Author;
  properties: PrototypeProperties[];
};

export type FormErrors = {
  name: string;
  properties: Record<string, string>;
};

export type FormData = {
  authors: Author[];
  description: string;
  name: string;
  properties: PrototypeProperties[];
  prototypeId: Checklist['id'];
  revisedCode?: Checklist['code'];
  revisedName?: Checklist['name'];
};

export type Props = {
  formData: FormData;
  formMode: FormMode;
};
