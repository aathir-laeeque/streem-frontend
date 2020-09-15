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
import { resendInvite } from '../actions';
import { updateProfile } from '#views/Auth/actions';

type Inputs = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  department: string;
  facilities: string;
  roles: string[];
};

const EditUser: FC<ViewUserProps> = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useTypedSelector((state) => state.users);
  const { list, loading } = useTypedSelector((state) => state.facilities);

  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  const { register, handleSubmit, errors, formState, reset, watch } = useForm<
    Inputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      firstName: selectedUser?.firstName,
      lastName: selectedUser?.lastName,
      employeeId: selectedUser?.employeeId,
      email: selectedUser?.email,
      department: selectedUser?.department,
      facilities: selectedUser?.facilities?.map((f) => f.name).toString(),
      roles: [selectedUser?.roles?.map((r) => r.id).toString() || ''],
    },
  });

  useEffect(() => {
    dispatch(fetchFacilities());
  }, []);

  useEffect(() => {
    document.getElementById('firstName')?.focus();
  }, [loading]);

  const onSubmit = (data: Inputs) => {
    const payload = data;
    reset({
      ...payload,
    });
    dispatch(updateProfile({ body: payload, id: selectedUser?.id || -1 }));
  };

  let rolePlaceholder = 'N/A';
  if (selectedUser?.roles && selectedUser?.roles[0]) {
    rolePlaceholder = capitalize(selectedUser.roles[0].name.replace('_', ' '));
  }

  if (list?.length === 0 || loading) {
    return <div>Loading...</div>;
  }

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
              refFun={register({
                required: true,
              })}
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
            {list?.map((facility) => (
              <div className="facilities" key={`${facility.id}`}>
                <Checkbox
                  refFun={register({
                    required: true,
                  })}
                  name="facilities"
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
            disabled={formState.isValid && formState.isDirty ? false : true}
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
            <Button className="button">Archive</Button>
          ) : (
            <Button className="button">Unarchive</Button>
          )}
        </div>
      </form>
    </Composer>
  );
};

export default EditUser;
