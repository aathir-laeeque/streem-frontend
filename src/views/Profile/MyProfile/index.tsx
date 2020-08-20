import React, { FC } from 'react';
import { Button, LabeledInput, Role, Thumbnail } from '#components';
import { Composer } from './styles';
import { MyProfileProps } from './types';
import { permissions, roles } from './temp';

const MyProfile: FC<MyProfileProps> = () => {
  return (
    <Composer>
      <div className="content">
        <div className="heading">Managing Your Profile</div>
        <div className="sub-heading" style={{ marginBottom: '16px' }}>
          Manage your profile or update the password of your account
        </div>
        <div className="flex-row">
          <div className="sub-heading bold">Basic Information</div>
        </div>
        <Thumbnail
          source={{ firstName: 'Paul', lastName: 'Burton' }}
          id="avatar"
        />
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
              disabled
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Department"
              label="Department"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Facilities"
              label="Facilities"
              id="username"
            />
          </div>
        </div>
        <div className="flex-row" style={{ paddingBottom: 0 }}>
          <div className="flex-col right-gutter">
            <Role
              permissions={permissions}
              roles={roles}
              placeHolder="System Admin"
              label="Role"
              id="role"
              disabled
              selected={2}
            />
          </div>
        </div>
        <div className="partition" />
        <div className="sub-heading bold">Password</div>
        <div className="sub-title">
          Your new password should comply with the Password Policy
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Enter Current Password"
              label="Current Password"
              id="current-password"
              type="password"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Enter New Password"
              label="New Password"
              id="new-password"
              type="password"
            />
          </div>
        </div>
      </div>
      <div className="actions">
        <Button className="primary-button" type="submit" disabled>
          Save Changes
        </Button>
      </div>
    </Composer>
  );
};

export default MyProfile;