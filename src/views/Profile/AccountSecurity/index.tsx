import React, { FC, useState, useEffect } from 'react';
import { Button, LabeledInput } from '#components';
import { Composer } from './styles';
import { AccountSecurityProps } from './types';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '#store';
import { useForm, ValidationRules } from 'react-hook-form';
import { updateProfile } from '#views/Auth/actions';

type Inputs = {
  oldPassword: string;
  newPassword: string;
};

interface ValidatorProps {
  functions: ValidationRules['validate'];
  messages: Record<string, string>;
}

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

const AccountSecurity: FC<AccountSecurityProps> = () => {
  const dispatch = useDispatch();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { profile } = useTypedSelector((state) => state.auth);
  const { register, handleSubmit, errors, formState, trigger } = useForm<
    Inputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { functions, messages } = validators;

  useEffect(() => {
    trigger('newPassword');
  }, []);

  const onSubmit = (data: Inputs) => {
    const payload = {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    };
    dispatch(updateProfile({ body: payload, id: profile?.id || 0 }));
  };

  return (
    <Composer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content">
          <div className="heading">Managing Your Password</div>
          <div className="sub-heading" style={{ marginBottom: '16px' }}>
            Update your password to access STREEM
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
                type="password"
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
                type="password"
                onFocusInput={() => setPasswordFocused(true)}
              />
              {passwordFocused && (
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
    </Composer>
  );
};

export default AccountSecurity;
