import React, { FC } from 'react';
import { Button, LabeledInput } from '#components';
import { Composer } from './styles';
import { MyProfileProps } from './types';

const MyProfile: FC<MyProfileProps> = () => {
  return (
    <Composer>
      <div className="content">
        <div className="heading">Managing Your Profile</div>
        <div className="sub-heading">
          Manage your profile or update the password of your account
        </div>
        <div className="flex-row">
          <div className="sub-heading bold">Basic Information</div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
              disabled
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-col right-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
            />
          </div>
          <div className="flex-col left-gutter">
            <LabeledInput
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
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
