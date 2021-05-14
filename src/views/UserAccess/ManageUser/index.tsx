import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { fetchFacilities } from '#store/facilities/actions';
import { fetchSelectedUser } from '#store/users/actions';
import { User } from '#store/users/types';
import { capitalize } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { RoleType } from '../types';
import ManageUser from './ManageUser';
import { roles } from './temp';
import { PAGE_TYPE, ViewUserProps } from './types';

type InitialState = {
  isLoaded: boolean;
  isEditable: boolean;
  isAccountOwner: boolean;
  rolePlaceholder: string;
  selectedRoles: RoleType[];
};

type AccumulatorType = Pick<
  InitialState,
  'selectedRoles' | 'isAccountOwner'
> & { rolePlaceholder: string[] };

const EditUserContainer: FC<ViewUserProps> = ({ id, pageType }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useTypedSelector((state) => state.users);
  const { list } = useTypedSelector((state) => state.facilities);

  const [state, setState] = useState<InitialState>({
    isLoaded: false,
    isEditable: false,
    isAccountOwner: false,
    rolePlaceholder: '',
    selectedRoles: [],
  });

  useEffect(() => {
    dispatch(fetchFacilities());

    if (pageType === PAGE_TYPE.ADD) {
      setState({
        isLoaded: true,
        isEditable: true,
        isAccountOwner: false,
        rolePlaceholder: 'Role',
        selectedRoles: [],
      });
    } else {
      if (id) {
        dispatch(fetchSelectedUser(id));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const { selectedRoles, isAccountOwner, rolePlaceholder } = roles.reduce<
        AccumulatorType
      >(
        (accumulator, role) => {
          const isUserRole = selectedUser?.roles?.some(
            (userRole) => userRole.id === role.id,
          );
          if (isUserRole) {
            accumulator.selectedRoles.push(role);
            accumulator.rolePlaceholder.push(
              ' ' + capitalize(role.name.replace('_', ' ')),
            );
            if (role.id === roles[0].id) accumulator.isAccountOwner = true;
          }
          return accumulator;
        },
        {
          selectedRoles: [],
          isAccountOwner: false,
          rolePlaceholder: [],
        },
      );

      const isEditable = checkPermission([
        'usersAndAccess',
        'selectedUser',
        'form',
        'editable',
      ])
        ? isAccountOwner
          ? checkPermission(['usersAndAccess', 'editAccountOwner'])
          : true
        : false;

      setState({
        isLoaded: true,
        rolePlaceholder: rolePlaceholder.toString(),
        isAccountOwner,
        isEditable: pageType === PAGE_TYPE.PROFILE ? false : isEditable,
        selectedRoles,
      });
    }
  }, [selectedUser?.id]);

  const {
    isLoaded,
    isEditable,
    isAccountOwner,
    rolePlaceholder,
    selectedRoles,
  } = state;

  if (!isLoaded || !list?.length) {
    return <div>Loading...</div>;
  }

  return (
    <ManageUser
      user={selectedUser as User}
      facilities={list}
      isEditable={isEditable}
      isAccountOwner={isAccountOwner}
      rolePlaceholder={rolePlaceholder}
      selectedRoles={selectedRoles}
      pageType={pageType}
    />
  );
};

export default EditUserContainer;
