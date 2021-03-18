import { Button, LabeledInput, Role, TabContentProps } from '#components';
import { useTypedSelector } from '#store';
import { updateProfile } from '#views/Auth/actions';
import { permissions, roles } from '#views/UserAccess/AddUser/temp';
import { RoleType } from '#views/UserAccess/types';
import { capitalize } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CommonWrapper } from '../styles';

type Inputs = {
  firstName: string;
  lastName: string;
  employeeId: string;
  username: string;
  email: string;
  department: string;
  facilities: string;
  roles: string;
};

type InitialState = {
  rolePlaceholder: string;
  selectedRoles: RoleType[];
};

type AccumulatorType = Pick<InitialState, 'selectedRoles'> & {
  rolePlaceholder: string[];
};

const MyProfile: FC<TabContentProps> = () => {
  const dispatch = useDispatch();
  const { profile } = useTypedSelector((state) => state.auth);
  const [state, setState] = useState<InitialState>({
    rolePlaceholder: '',
    selectedRoles: [],
  });

  const { register, handleSubmit, errors, formState, reset } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      username: profile?.username,
      employeeId: profile?.employeeId,
      email: profile?.email,
      department: profile?.department,
      facilities: profile?.facilities?.map((f) => f.name).toString(),
      roles: profile?.roles?.map((r) => r.name).toString(),
    },
  });

  const { selectedRoles, rolePlaceholder } = state;

  useEffect(() => {
    const { selectedRoles, rolePlaceholder } = roles.reduce<AccumulatorType>(
      (accumulator, role) => {
        const isUserRole = profile?.roles?.some(
          (userRole) => userRole.id === role.id,
        );
        if (isUserRole) {
          accumulator.selectedRoles.push(role);
          accumulator.rolePlaceholder.push(
            capitalize(role.name.replace('_', ' ')),
          );
        }
        return accumulator;
      },
      {
        selectedRoles: [],
        rolePlaceholder: [],
      },
    );
    setState({ rolePlaceholder: rolePlaceholder.toString(), selectedRoles });
  }, []);

  useEffect(() => {
    if (rolePlaceholder) {
      document.getElementById('firstName')?.focus();
    }
  }, [rolePlaceholder]);

  const onSubmit = (data: Inputs) => {
    const payload = {
      firstName: data?.firstName,
      lastName: data?.lastName,
    };
    reset();
    if (profile?.id)
      dispatch(updateProfile({ body: payload, id: profile?.id }));
  };

  return (
    <CommonWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content">
          <div className="heading">Managing Your Profile</div>
          <div className="sub-heading" style={{ marginBottom: '16px' }}>
            Manage your profile or update the password of your account
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
                refFun={register}
                placeHolder="Username"
                label="Username"
                id="username"
                disabled
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                })}
                placeHolder="Employee ID"
                label="Employee ID"
                id="employeeId"
                disabled
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
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
                disabled
              />
            </div>
            <div className="flex-col left-gutter">
              <LabeledInput
                refFun={register}
                placeHolder="Department"
                label="Department"
                id="department"
                disabled
              />
            </div>
          </div>
          <div className="flex-row" style={{ paddingBottom: 0 }}>
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register}
                placeHolder="Facilities"
                label="Facilities"
                id="facilities"
                disabled
              />
            </div>
            <div className="flex-col left-gutter" style={{ marginTop: '-5px' }}>
              <Role
                refFun={register({
                  required: true,
                })}
                permissions={permissions}
                roles={roles}
                placeHolder={rolePlaceholder}
                label="Role"
                id="roles-input"
                disabled
                selected={selectedRoles}
              />
            </div>
          </div>
        </div>
        <div className="actions">
          <Button
            className="primary-button"
            type="submit"
            disabled={!formState.isValid || !formState.isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </CommonWrapper>
  );
};

export default MyProfile;
