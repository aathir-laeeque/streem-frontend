import checkPermission, { RoleIdByName } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { fetchFacilities } from '#store/facilities/actions';
import { fetchSelectedUser } from '#store/users/actions';
import { User } from '#store/users/types';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ManageUser from './ManageUser';
import { PAGE_TYPE, ViewUserProps } from './types';

export type InitialState = {
  isLoaded: boolean;
  isEditable: boolean;
  isAccountOwner: boolean;
};

const EditUserContainer: FC<ViewUserProps> = ({ id, pageType }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useTypedSelector((state) => state.users);
  const { list } = useTypedSelector((state) => state.facilities);

  const [state, setState] = useState<InitialState>({
    isLoaded: false,
    isEditable: false,
    isAccountOwner: false,
  });

  useEffect(() => {
    dispatch(fetchFacilities());

    if (pageType === PAGE_TYPE.ADD) {
      setState({
        isLoaded: true,
        isEditable: true,
        isAccountOwner: false,
      });
    } else {
      if (id) {
        dispatch(fetchSelectedUser(id));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const isAccountOwner = !!(
        selectedUser.roles &&
        selectedUser.roles[0].id === RoleIdByName.ACCOUNT_OWNER
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
        isAccountOwner,
        isEditable: pageType === PAGE_TYPE.PROFILE ? false : isEditable,
      });
    }
  }, [selectedUser?.id]);

  const { isLoaded, isEditable, isAccountOwner } = state;

  if (!isLoaded || !list?.length) {
    return <div>Loading...</div>;
  }

  return (
    <ManageUser
      user={selectedUser as User}
      facilities={list}
      isEditable={isEditable}
      isAccountOwner={isAccountOwner}
      pageType={pageType}
    />
  );
};

export default EditUserContainer;
