import { Button, Card, LabeledInput } from '#components';
import { useTypedSelector } from '#store';
import { ValidatorProps } from '#utils/globalTypes';
import { Visibility } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { checkTokenExpiry, resetError, resetPassword } from '../actions';
import InvalidToken from '../InvalidToken';
import { TokenTypes } from '../types';
import { ResetPasswordProps } from './types';

type Inputs = {
  newPassword: string;
};

const ResetPassword: FC<ResetPasswordProps> = ({ token }) => {
  const { register, handleSubmit, trigger, errors, formState } = useForm<
    Inputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { error, isTokenExpired, loading } = useTypedSelector(
    (state) => state.auth,
  );

  const validators: ValidatorProps = {
    functions: {
      resetError: (value: string) => {
        error && dispatch(resetError());
        return true;
      },
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

  const { functions, messages } = validators;

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && isTokenExpired === undefined) {
      dispatch(
        checkTokenExpiry({
          token: token.toString(),
          type: TokenTypes.PASSWORD_RESET,
        }),
      );
    } else if (token && isTokenExpired === false) {
      trigger('newPassword');
      document.getElementById('newPassword')?.focus();
    }
  }, [isTokenExpired]);

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

  if (isTokenExpired === undefined)
    return <div style={{ textAlign: 'center', padding: 10 }}>Loading...</div>;

  if (isTokenExpired)
    return (
      <InvalidToken
        heading="Request Expired"
        subHeading="Request has expired. Use the Forgot Password option again."
      />
    );

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
                    errors?.newPassword?.types?.[item]
                      ? { backgroundColor: '#bababa' }
                      : {}
                  }
                />
                {messages[item]}
              </div>
            ),
          )}
        </div>
        <div
          className="row"
          style={{
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {error && <span className="error-span">{error}</span>}
          <Button
            className="primary-button"
            type="submit"
            disabled={!formState.isValid || !formState.isDirty || loading}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPassword;
