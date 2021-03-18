import { Button, LabeledInput, TabContentProps } from '#components';
import { useTypedSelector } from '#store';
import { ValidatorProps } from '#utils/globalTypes';
import { updatePassword } from '#views/Auth/actions';
import { Visibility } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CommonWrapper } from '../styles';

export type PasswordRequestInputs = {
  oldPassword: string;
  newPassword: string;
};

const validators: ValidatorProps = {
  functions: {
    smallLength: (value: string) => value.length > 7,
    smallCaseLetter: (value: string) => /[a-z]/.test(value),
    capitalCaseLetter: (value: string) => /[A-Z]/.test(value),
    specialChar: (value: string) => /.*[!@#$%^&*() =+_-]/.test(value),
    digitLetter: (value: string) => /[0-9]/.test(value),
  },
  messages: {
    smallLength: '8 characters minimum',
    smallCaseLetter: 'One lowercase character',
    capitalCaseLetter: 'One uppercase character',
    specialChar: 'One special character',
    digitLetter: 'One number',
  },
};

const AccountSecurity: FC<TabContentProps> = () => {
  const dispatch = useDispatch();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [oldPasswordInputType, setOldPasswordInputType] = useState(true);
  const [newPasswordInputType, setNewPasswordInputType] = useState(true);
  const { profile } = useTypedSelector((state) => state.auth);
  const { register, handleSubmit, errors, formState, trigger, reset } = useForm<
    PasswordRequestInputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { functions, messages } = validators;

  useEffect(() => {
    trigger('newPassword');
  }, []);

  const onSubmit = (data: PasswordRequestInputs) => {
    const payload = {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
      // token: null,
    };
    if (profile?.id)
      dispatch(updatePassword({ body: payload, id: profile.id.toString() }));
    reset();
  };

  return (
    <CommonWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content">
          <div className="heading">Managing Your Password</div>
          <div className="sub-heading" style={{ marginBottom: '16px' }}>
            Update your password to access CLEEN
          </div>
          <div className="sub-heading bold" style={{ marginTop: '32px' }}>
            Password
          </div>
          <div className="sub-title">
            Your new password should comply with the Password Policy
          </div>
          <div className="flex-row">
            <div className="flex-col right-gutter">
              <LabeledInput
                refFun={register({
                  required: true,
                })}
                placeHolder="Enter Current Password"
                label="Current Password"
                id="oldPassword"
                type={oldPasswordInputType ? 'password' : 'text'}
                icon={
                  <Visibility
                    onClick={() =>
                      setOldPasswordInputType(!oldPasswordInputType)
                    }
                    style={{
                      color: oldPasswordInputType ? '#999999' : '#1d84ff',
                    }}
                  />
                }
              />
            </div>
            <div
              className="flex-col left-gutter"
              style={{ flexDirection: 'column' }}
            >
              <LabeledInput
                refFun={register({
                  validate: functions,
                })}
                placeHolder="Enter New Password"
                label="New Password"
                id="newPassword"
                type={newPasswordInputType ? 'password' : 'text'}
                icon={
                  <Visibility
                    onClick={() =>
                      setNewPasswordInputType(!newPasswordInputType)
                    }
                    style={{
                      color: newPasswordInputType ? '#999999' : '#1d84ff',
                    }}
                  />
                }
                onFocusInput={() => setPasswordFocused(true)}
              />
              {passwordFocused && formState.isDirty && (
                <div className="error-container">
                  {Object.keys(messages).map(
                    (item): JSX.Element => (
                      <div key={`${item}`}>
                        <div
                          className="indicator"
                          style={
                            errors.newPassword?.types &&
                            errors.newPassword?.types[item]
                              ? { backgroundColor: '#bababa' }
                              : {}
                          }
                        />
                        {messages[item]}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
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
        </div>
      </form>
    </CommonWrapper>
  );
};

export default AccountSecurity;
