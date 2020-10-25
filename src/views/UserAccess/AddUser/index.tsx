import React, { FC, useEffect } from 'react';
import {
  Button,
  LabeledInput,
  Checkbox,
  Role,
  HeaderWithBack,
} from '#components';
import { apiCheckEmail, apiCheckEmployeeId } from '#utils/apiUrls';
import { request } from '#utils/request';
import { debounce } from 'lodash';
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
  roles: any[];
  facilities: any[];
};

// TODO Make Facilities Multi Checkable and Showable like Roles

const AddUser: FC<AddUserProps> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFacilities());
  }, []);

  const { list, loading } = useTypedSelector((state) => state.facilities);

  useEffect(() => {
    document.getElementById('firstName')?.focus();
  }, []);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
    clearErrors,
    setError,
  } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { employeeId, email, roles: rolesValues } = watch([
    'employeeId',
    'email',
    'roles',
  ]);

  const onSubmit = (data: Inputs) => {
    const parsedRoles: { id: string }[] = [];
    data.roles.forEach((r) => {
      if (r !== false) parsedRoles.push({ id: r });
    });
    const parsedFacilities: { id: string }[] = [];
    data.facilities.forEach((r) => {
      if (r !== false) parsedFacilities.push({ id: r });
    });
    const payload = {
      ...data,
      email: data.email.toLowerCase(),
      roles: parsedRoles,
      facilities: parsedFacilities,
    };
    dispatch(addUser(payload));
  };

  if (list?.length === 0 || loading) {
    return <div>Loading...</div>;
  }

  console.log('isValid', formState.isValid);

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
                  validate: async (value) => {
                    if (!employeeId) return true;
                    if (value === employeeId) return true;
                    return new Promise((resolve) => {
                      debounce(async (employeeId) => {
                        const { errors } = await request(
                          'GET',
                          apiCheckEmployeeId(employeeId),
                        );
                        let message: string | boolean = true;
                        if (errors && errors.length > 0) {
                          message = 'Employee ID already exists';
                          setError('employeeId', { message });
                        } else {
                          clearErrors('employeeId');
                        }
                        resolve(message);
                      }, 500)(value);
                    });
                  },
                })}
                placeHolder="Employee ID"
                label="Employee ID"
                id="employeeId"
                error={
                  errors['employeeId']?.message !== ''
                    ? errors['employeeId']?.message
                    : undefined
                }
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
                  validate: async (value) => {
                    if (!email) return true;
                    if (value === email) return true;
                    return new Promise((resolve) => {
                      debounce(async (email) => {
                        const { errors } = await request(
                          'GET',
                          apiCheckEmail(email),
                        );
                        let message: string | boolean = true;
                        if (errors && errors.length > 0) {
                          message = 'Email ID already exists';
                          setError('email', { message });
                        } else {
                          clearErrors('email');
                        }
                        resolve(message);
                      }, 500)(value);
                    });
                  },
                })}
                placeHolder="Email ID"
                label="Email ID"
                id="email"
                error={
                  errors['email']?.message !== ''
                    ? errors['email']?.message
                    : undefined
                }
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
              placeHolder="Select Role"
              label="Role"
              id="roles"
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
