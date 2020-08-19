import React, { FC } from 'react';
import { Button, LabeledInput, Checkbox, Role } from '#components';
import { navigate } from '@reach/router';
import { Composer } from './styles';
import { NewUserProps } from './types';
import { permissions, roles } from './temp';

const NewUser: FC<NewUserProps> = () => {
  return (
    <Composer>
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
              placeHolder="First Name"
              label="First Name"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Last Name"
              label="Last Name"
              id="username"
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Employee ID"
              label="Employee ID"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Email ID"
              label="Email ID"
              id="username"
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Department"
              label="Department"
              id="username"
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
            permissions={permissions}
            roles={roles}
            placeHolder="System Admin"
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
          <div className="flex-col right-gutter">
            <Checkbox
              label="Manuelaland"
              onClick={() => console.log('cheked')}
            />
          </div>
          <div className="flex-col left-gutter">
            <Checkbox label="Haneton" onClick={() => console.log('cheked')} />
          </div>
        </div>
      </div>
      <div className="actions">
        <Button className="primary-button" type="submit" disabled>
          Save Changes
        </Button>
        <div className="flex-row">
          <Button className="primary-button flat" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </Composer>
  );
};

export default NewUser;
