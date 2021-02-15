import { Button, Card, LabeledInput } from '#components';
import { apiCheckUsername } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useForm, ValidationRules } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { checkTokenExpiry, register as registerAction } from '../actions';
import InvalidToken from '../InvalidToken';
import { RegisterProps } from './types';
import { useTypedSelector } from '#store';
import { TokenTypes } from '../types';

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  username: string;
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

const Register: FC<RegisterProps> = ({ name, email, token }) => {
  const { register, handleSubmit, trigger, errors, formState } = useForm<
    Inputs
  >({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      fullName: name,
      email: email,
    },
  });
  const { isTokenExpired } = useTypedSelector((state) => state.auth);
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { functions, messages } = validators;

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && isTokenExpired === undefined) {
      dispatch(
        checkTokenExpiry({
          token: token.toString(),
          type: TokenTypes.REGISTRATION,
        }),
      );
    } else if (token && isTokenExpired === false) {
      trigger('password');
      document.getElementById('username')?.focus();
    }
  }, [isTokenExpired]);

  const onSubmit = (data: Inputs) => {
    const { password, username } = data;
    if (token) {
      dispatch(
        registerAction({
          username: username.toString(),
          password: password.toString(),
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
        heading="Invitaton Expired"
        subHeading="Your invitation to join CLEEN has expired. Please contact your Administrator for next steps."
      />
    );

  return (
    <Card
      heading="Welcome to CLEEN!"
      subHeading="Set a new password for your account."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <LabeledInput
            refFun={register}
            placeHolder="John Doe"
            label="Full Name"
            id="fullName"
            disabled
          />
        </div>
        <div className="row" style={{ paddingTop: '24px' }}>
          <LabeledInput
            refFun={register}
            placeHolder="Enter your username or Email ID"
            label="Email ID"
            id="email"
            disabled
          />
        </div>
        <div className="row right-align">
          <Link className="link" to="/auth/login">
            Not you?
          </Link>
        </div>
        <div className="row" style={{ paddingTop: '4px' }}>
          <LabeledInput
            placeHolder="Enter your username"
            label="Username"
            id="username"
            type="text"
            error={errors['username']?.message}
            refFun={register({
              required: true,
              pattern: {
                value: /^[a-z0-9]+$/i,
                message: 'Invalid Username',
              },
              validate: async (value) => {
                const { errors } = await request(
                  'GET',
                  apiCheckUsername(value.toLowerCase()),
                );
                if (errors?.length)
                  return errors?.[0]?.message || 'Username Already Taken';
                return true;
              },
            })}
          />
          <span className="hint">
            This is your unique CLEEN ID and is used to log in to the App.
            Alpha-numeric characters only.
          </span>
        </div>
        <div className="row" style={{ paddingTop: '4px' }}>
          <LabeledInput
            placeHolder="Enter your password"
            label="Password"
            id="password"
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
                  {...(errors.password?.types?.[item] && {
                    style: { backgroundColor: '#bababa' },
                  })}
                />
                {messages[item]}
              </div>
            ),
          )}
        </div>
        <div className="row">
          <Button
            className="primary-button"
            type="submit"
            disabled={!formState.isValid || !formState.isDirty}
          >
            Register
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Register;
