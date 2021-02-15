import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Role,
  HeaderWithBack,
  Checkbox,
  LabeledInput,
} from '#components';
import { fetchFacilities } from '#store/facilities/actions';
import { useForm } from 'react-hook-form';
import { capitalize, size, noop, pickBy, identity } from 'lodash';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '#store';
import { navigate } from '@reach/router';
import { Composer } from './styles';
import { ViewUserProps } from './types';
import { permissions, roles } from '../AddUser/temp';
import checkPermission from '#services/uiPermissions';
import {
  archiveUser,
  cancelInvite,
  resendInvite,
  unArchiveUser,
} from '../actions';
import { updateUserProfile } from '#views/Auth/actions';
import { fetchSelectedUser } from '#store/users/actions';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { User } from '#store/users/types';
import { modalBody } from '../ListView/TabContent';
import { apiCheckEmail } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Facilities } from '#store/facilities/types';
import { RoleType } from '../types';

type Inputs = {
  firstName: string;
  lastName: string;
  username: string;
  employeeId: string;
  email: string;
  department: string;
  roles: any[];
  facilities: any[];
};

// TODO Make Facilities Multi Checkable and Showable like Roles

const EditUser: FC<{
  user: User;
  facilities: Facilities;
  rolePlaceholder: string;
  isAccountOwner: boolean;
  isEditable: boolean;
  selectedRoles: RoleType[];
}> = ({
  user: selectedUser,
  facilities: list,
  rolePlaceholder,
  isAccountOwner,
  isEditable,
  selectedRoles,
}) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, formState, reset, watch } = useForm<
    Inputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      firstName: selectedUser?.firstName,
      lastName: selectedUser?.lastName,
      employeeId: selectedUser?.employeeId,
      username: selectedUser?.username,
      email: selectedUser?.email,
      department: selectedUser?.department,
      ...Object.fromEntries(
        selectedUser?.facilities?.map((f, i) => [`facilities[${i}]`, f.id]) ||
          [],
      ),
      ...Object.fromEntries(
        roles?.map((r, i) => [
          `roles[${i}]`,
          selectedUser?.roles?.some((sr) => sr.id == r.id) ? r.id : false,
        ]) || [],
      ),
    },
  });

  const { roles: rolesValues, email } = watch(['roles', 'email']);

  useEffect(() => {
    document.getElementById('firstName')?.focus();
  }, []);

  const onSubmit = (payload: Inputs) => {
    const parsedRoles: { id: string }[] = [];
    payload.roles.forEach((r) => {
      if (r !== false) parsedRoles.push({ id: r });
    });
    const parsedFacilities: { id: string }[] = [];
    payload.facilities.forEach((r) => {
      if (r !== false) parsedFacilities.push({ id: r });
    });
    if (selectedUser?.id) {
      reset({
        ...selectedUser,
        ...pickBy(payload, identity),
      });
      dispatch(
        updateUserProfile({
          body: {
            ...payload,
            roles: parsedRoles,
            facilities: parsedFacilities,
          },
          id: selectedUser.id,
        }),
      );
    }
  };

  const onArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Archiving a User',
          primaryText: 'Archive User',
          onPrimary: () =>
            dispatch(
              archiveUser({
                id: user.id,
              }),
            ),
          body: modalBody(user, 'You’re about to archive'),
        },
      }),
    );
  };

  const onUnArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Unarchiving a User',
          primaryText: 'Unarchive User',
          onPrimary: () =>
            dispatch(
              unArchiveUser({
                id: user.id,
              }),
            ),
          body: modalBody(user, 'You’re about to unarchive'),
        },
      }),
    );
  };

  const onCancelInvite = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Cancel Pending Invite',
          primaryText: 'Cancel Invite',
          onPrimary: () =>
            dispatch(
              cancelInvite({
                id: user.id,
              }),
            ),
          body: modalBody(user, 'You are about to cancel the invite sent to'),
        },
      }),
    );
  };

  console.log('formState.dirtyFields', formState.dirtyFields);
  console.log('formState.isValid', formState.isValid);

  return (
    <Composer>
      <HeaderWithBack
        heading={`${selectedUser.firstName} ${selectedUser.lastName}`}
        actionText="Back to User Management"
        onActionPress={() => navigate(-1)}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content">
          <div className="heading">Viewing a User</div>
          <div className="sub-heading" style={{ marginBottom: '16px' }}>
            View a User&apos;s Info, Permissions and Facility Access
          </div>
          <div className="flex-row">
            <div className="sub-heading bold">Basic Information</div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                isOn
                refFun={register({
                  required: true,
                })}
                placeHolder="First Name"
                label="First Name"
                id="firstName"
                error={errors['firstName']?.message}
                disabled={!isEditable}
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                isOn
                refFun={register({
                  required: true,
                })}
                placeHolder="Last Name"
                label="Last Name"
                id="lastName"
                error={errors['lastName']?.message}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                isOn
                refFun={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                  validate: async (value) => {
                    if (selectedUser.email === value) return true;
                    const { errors } = await request(
                      'GET',
                      apiCheckEmail(value.toLowerCase()),
                    );
                    if (errors?.length)
                      return errors?.[0]?.message || 'Email ID already exists';
                    return true;
                  },
                })}
                placeHolder="Email ID"
                label="Email ID"
                id="email"
                error={errors['email']?.message}
                disabled={!isEditable}
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                isOn
                refFun={register}
                placeHolder="Department"
                label="Department"
                id="department"
                required={false}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register}
                placeHolder="Employee ID"
                label="Employee ID"
                id="employeeId"
                error={errors['employeeId']?.message}
                disabled
              />
            </div>
            <div className="flex-col left-gutter">
              {selectedUser.verified && (
                <LabeledInput
                  refFun={register}
                  placeHolder="Username"
                  label="Username"
                  id="username"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="partition" style={{ marginTop: '16px' }} />
          <div className="sub-heading bold">Roles</div>
          <div className="sub-title">
            Please select at least one (1) role for this user
          </div>
          <div className="flex-row" style={{ paddingBottom: 0 }}>
            <Role
              disabled={!isEditable || isAccountOwner}
              refFun={register}
              permissions={permissions}
              roles={roles}
              placeHolder={rolePlaceholder}
              label="Role"
              id="roles"
              selected={selectedRoles}
            />
          </div>
          <div className="partition" />
          <div className="sub-heading bold">Facilities</div>
          <div className="sub-title">
            Please select at least one (1) Facility for this user
          </div>
          <div className="flex-row">
            {list?.map((facility, i) => (
              <div className="facilities" key={`${facility.id}`}>
                <Checkbox
                  key={`${facility.id}`}
                  refFun={register({
                    required: true,
                  })}
                  name={`facilities[${i}]`}
                  value={`${facility.id}`}
                  label={facility.name}
                  onClick={() => noop}
                  disabled={!isEditable}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="actions">
          {isEditable && (
            <>
              <Button
                className="primary-button"
                type="submit"
                disabled={
                  !rolesValues?.some((r) => r !== false) ||
                  !formState.isValid ||
                  !size(formState.dirtyFields)
                }
              >
                Save Changes
              </Button>
              {(() => {
                if (isAccountOwner) return null;
                else {
                  if (selectedUser.archived) {
                    return (
                      <Button
                        className="button"
                        onClick={() => onUnArchiveUser(selectedUser)}
                      >
                        Unarchive
                      </Button>
                    );
                  } else {
                    if (selectedUser.verified)
                      return (
                        <Button
                          className="button"
                          onClick={() => onArchiveUser(selectedUser)}
                        >
                          Archive
                        </Button>
                      );

                    return (
                      <>
                        <Button
                          className="button"
                          onClick={() =>
                            dispatch(resendInvite({ id: selectedUser.id }))
                          }
                        >
                          Resend Invite
                        </Button>
                        <Button
                          className="button cancel"
                          onClick={() => onCancelInvite(selectedUser)}
                        >
                          Cancel Invite
                        </Button>
                      </>
                    );
                  }
                }
              })()}
            </>
          )}
        </div>
      </form>
    </Composer>
  );
};

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

const EditUserContainer: FC<ViewUserProps> = () => {
  const dispatch = useDispatch();
  const { selectedUser, selectedUserId } = useTypedSelector(
    (state) => state.users,
  );
  const { list } = useTypedSelector((state) => state.facilities);

  const [state, setState] = useState<InitialState>({
    isLoaded: false,
    isEditable: false,
    isAccountOwner: false,
    rolePlaceholder: '',
    selectedRoles: [],
  });

  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchFacilities());
      dispatch(fetchSelectedUser(selectedUserId));
    }
  }, []);

  useEffect(() => {
    if (selectedUser && list?.length) {
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
              capitalize(role.name.replace('_', ' ')),
            );
            if (role.id === '1') accumulator.isAccountOwner = true;
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
        isEditable,
        selectedRoles,
      });
    }
  }, [selectedUser, list?.length]);

  const {
    isLoaded,
    isEditable,
    isAccountOwner,
    rolePlaceholder,
    selectedRoles,
  } = state;

  if (!isLoaded || !selectedUser || !list?.length) {
    return <div>Loading...</div>;
  }

  return (
    <EditUser
      user={selectedUser}
      facilities={list}
      isEditable={isEditable}
      isAccountOwner={isAccountOwner}
      rolePlaceholder={rolePlaceholder}
      selectedRoles={selectedRoles}
    />
  );
};

export default EditUserContainer;
