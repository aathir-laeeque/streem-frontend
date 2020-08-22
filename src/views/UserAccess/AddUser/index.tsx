import React, { FC, useEffect } from 'react';
import {
  Button,
  LabeledInput,
  Checkbox,
  Role,
  HeaderWithBack,
} from '#components';
import { fetchFacilities } from '#store/facilities/actions';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '#store';
import { navigate } from '@reach/router';
import { Composer } from './styles';
import { AddUserProps } from './types';
import { permissions, roles } from './temp';
import { useForm } from 'react-hook-form';
import { addUser } from '../actions';

type Inputs = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  department: string;
  facilities: any;
  roles: any;
};

const AddUser: FC<AddUserProps> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFacilities());
  }, []);

  const { list, loading } = useTypedSelector((state) => state.facilities);

  useEffect(() => {
    document.getElementById('firstName')?.focus();
  }, [loading]);

  const { register, handleSubmit, errors, formState } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Inputs) => {
    const roles =
      typeof data.roles === 'string'
        ? [{ id: parseInt(data.roles) }]
        : data.roles.map((role: string) => ({
            id: parseInt(role),
          }));
    const facilities =
      typeof data.facilities === 'string'
        ? [{ id: parseInt(data.facilities) }]
        : data.facilities.map((facility: string) => ({
            id: parseInt(facility),
          }));
    const payload = {
      ...data,
      roles,
      facilities,
    };
    dispatch(addUser(payload));
  };

  if (list?.length === 0 || loading) {
    return <div>Loading...</div>;
  }

  return (
    <Composer>
      <HeaderWithBack
        heading="Add New User"
        actionText="Back to User Management"
        onActionPress={() => navigate(-1)}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content">
          <div className="heading">Adding a New User</div>
          <div className="sub-heading" style={{ marginBottom: '16px' }}>
            Enter all the mandatory details below to add a new user
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
              placeHolder="Select Role"
              label="Role"
              id="role"
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
            disabled={!formState.isValid}
          >
            Save Changes
          </Button>
          <div className="flex-row">
            <Button
              className="primary-button flat"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </form>
    </Composer>
  );
};

export default AddUser;
