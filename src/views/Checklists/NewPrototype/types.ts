import { Checklist } from '#Composer-new/checklist.types';
import { Property } from '#store/properties/types';
import { User } from '#store/users/types';

import { addNewPrototype, updatePrototype } from './actions';

export enum NewPrototypeActions {
  ADD_NEW_PROTOTYPE = '@@prototype/ADD_NEW_PROTOTYPE',
  UPDATE_PROTOTYPE = '@@prototype/UPDATE_PROTOTYPE',
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
};

export enum FormMode {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

export type FormValues = {
  authors: Author[];
  name: string;
  properties: PrototypeProperties[];
};

export type FormErrors = {
  name: string;
  properties: Record<string, string>;
};

export type FormData = {
  authors: Author[];
  name: string;
  properties: PrototypeProperties[];
  prototypeId: Checklist['id'];
};

export type Props = {
  formData: FormData;
  formMode: FormMode;
};
