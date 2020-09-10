import { Button, Card, LabeledInput } from '#components';
import { Visibility } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useForm, ValidationRules } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { resetPassword } from '../actions';
import { ResetPasswordProps } from './types';

type Inputs = {
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

const ResetPassword: FC<ResetPasswordProps> = ({ token }) => {
  const { register, handleSubmit, trigger, errors } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const [passwordInputType, setPasswordInputType] = useState(true);

  const { functions, messages } = validators;

  const dispatch = useDispatch();

  useEffect(() => {
    trigger('newPassword');
  }, []);

  const onSubmit = (data: Inputs) => {
    const { newPassword } = data;
    if (token) {
      dispatch(
        resetPassword({
          newPassword: newPassword.toString(),
          token: token.toString(),
        }),
      );
    }
  };

  return (
    <Card
      heading="Reset your Password"
      subHeading="Create a new password to login to CLEEN. Make sure your password complies with the passsword policy."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <LabeledInput
            placeHolder="New password"
            label="New Password"
            id="newPassword"
            type={passwordInputType ? 'password' : 'text'}
            icon={
              <Visibility
                onClick={() => setPasswordInputType(!passwordInputType)}
                style={{ color: passwordInputType ? '#999999' : '#1d84ff' }}
              />
            }
            refFun={register({
              validate: functions,
            })}
          />
        </div>
        <div className="row error-container">
          {Object.keys(messages).map(
            (item): JSX.Element => (
              <div key={`${item}`}>
                <div
                  className="indicator"
                  style={
                    errors.newPassword?.types && errors.newPassword?.types[item]
                      ? { backgroundColor: '#bababa' }
                      : {}
                  }
                />
                {messages[item]}
              </div>
            ),
          )}
        </div>
        <div className="row">
          <Button className="primary-button" type="submit">
            ResetPassword
          </Button>
        </div>
      </form>
      {/* <Terms /> */}
    </Card>
  );
};

export default ResetPassword;
