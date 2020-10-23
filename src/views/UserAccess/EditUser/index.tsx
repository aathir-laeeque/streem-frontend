import React, { FC, useEffect } from 'react';
import {
  Button,
  Role,
  HeaderWithBack,
  Checkbox,
  LabeledInput,
} from '#components';
import { fetchFacilities } from '#store/facilities/actions';
import { useForm } from 'react-hook-form';
import { capitalize } from 'lodash';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '#store';
import { navigate } from '@reach/router';
import { Composer } from './styles';
import { ViewUserProps } from './types';
import { permissions, roles } from '../AddUser/temp';
import { archiveUser, resendInvite, unArchiveUser } from '../actions';
import { updateProfile } from '#views/Auth/actions';
import { fetchSelectedUser } from '#store/users/actions';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { User } from '#store/users/types';
import { modalBody } from '../ListView/TabContent';

type Inputs = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  department: string;
  roles: any[];
  facilities: any[];
};

// TODO Make Facilities Multi Checkable and Showable like Roles

const EditUser: FC<ViewUserProps> = () => {
  const dispatch = useDispatch();
  const { selectedUser, selectedUserId } = useTypedSelector(
    (state) => state.users,
  );
  const { list, loading } = useTypedSelector((state) => state.facilities);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    getValues,
    watch,
  } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  useEffect(() => {
    getValues;
    if (selectedUserId) {
      dispatch(fetchFacilities());
      dispatch(fetchSelectedUser(selectedUserId));
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      console.log(
        'selectedUser?.roles?.map((r, i) => [`roles[${i}]`, r.id])',
        Object.fromEntries(
          roles?.map((r, i) => [
            `roles[${i}]`,
            selectedUser?.roles?.some((sr) => sr.id == r.id) ? r.id : false,
          ]) || [],
        ),
      );
      reset({
        firstName: selectedUser?.firstName,
        lastName: selectedUser?.lastName,
        employeeId: selectedUser?.employeeId,
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
      });
      document.getElementById('firstName')?.focus();
    }
  }, [selectedUser]);

  const onSubmit = (data: Inputs) => {
    const payload = data;
    reset({
      ...payload,
    });
    const parsedRoles: { id: string }[] = [];
    payload.roles.forEach((r) => {
      if (r !== false) parsedRoles.push({ id: r });
    });
    const parsedFacilities: { id: string }[] = [];
    payload.facilities.forEach((r) => {
      if (r !== false) parsedFacilities.push({ id: r });
    });
    if (selectedUser?.id)
      dispatch(
        updateProfile({
          body: {
            ...payload,
            roles: parsedRoles,
            facilities: parsedFacilities,
          },
          id: selectedUser.id,
        }),
      );
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
                fetchData: () => {
                  console.log();
                },
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
                fetchData: () => {
                  console.log();
                },
              }),
            ),
          body: modalBody(user, 'You’re about to unarchive'),
        },
      }),
    );
  };

  let rolePlaceholder = 'N/A';
  if (selectedUser?.roles && selectedUser?.roles[0]) {
    rolePlaceholder = capitalize(selectedUser.roles[0].name.replace('_', ' '));
  }

  if (!selectedUser || list?.length === 0 || loading) {
    return <div>Loading...</div>;
  }

  const rolesValues = watch('roles');

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
            A brief description of what the user can do here
          </div>
          <div className="flex-row">
            <div className="sub-heading bold">Basic Information</div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                })}
                placeHolder="First Name"
                label="First Name"
                id="firstName"
                error={errors['firstName']?.message}
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                })}
                placeHolder="Last Name"
                label="Last Name"
                id="lastName"
                error={errors['lastName']?.message}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                })}
                placeHolder="Employee ID"
                label="Employee ID"
                id="employeeId"
                error={errors['employeeId']?.message}
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeHolder="Email ID"
                label="Email ID"
                id="email"
                error={errors['email']?.message}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register}
                placeHolder="Department"
                label="Department"
                id="department"
                required={false}
              />
            </div>
            <div className="flex-col left-gutter" />
          </div>
          <div className="partition" style={{ marginTop: '16px' }} />
          <div className="sub-heading bold">Roles</div>
          <div className="sub-title">
            Please select at least one (1) role for this user
          </div>
          <div className="flex-row" style={{ paddingBottom: 0 }}>
            <Role
              refFun={register}
              permissions={permissions}
              roles={roles}
              placeHolder={rolePlaceholder}
              label="Role"
              id="roles"
              selected={
                selectedUser?.roles && selectedUser?.roles[0]
                  ? selectedUser?.roles[0].id
                  : 3
              }
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
                  onClick={() => console.log('cheked')}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="actions">
          <Button
            className="primary-button"
            type="submit"
            disabled={
              rolesValues &&
              rolesValues.some((r) => r !== false) &&
              formState.isValid &&
              formState.isDirty
                ? false
                : true
            }
          >
            Save Changes
          </Button>
          {!selectedUser.verified && !selectedUser.archived ? (
            <>
              <Button
                className="button"
                onClick={() => dispatch(resendInvite({ id: selectedUser.id }))}
              >
                Resend Invite
              </Button>
              <Button className="button cancel">Cancel Invite</Button>
            </>
          ) : selectedUser.verified && !selectedUser.archived ? (
            <Button
              className="button"
              onClick={() => onArchiveUser(selectedUser)}
            >
              Archive
            </Button>
          ) : (
            <Button
              className="button"
              onClick={() => onUnArchiveUser(selectedUser)}
            >
              Unarchive
            </Button>
          )}
        </div>
      </form>
    </Composer>
  );
};

export default EditUser;
