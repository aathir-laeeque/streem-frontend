import { Button, Card, LabeledInput } from '#components';
import { apiCheckUsername } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useForm, ValidationRules } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { register as registerAction } from '../actions';
import { RegisterProps } from './types';

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
  const {
    register,
    handleSubmit,
    trigger,
    errors,
    setError,
    clearErrors,
    watch,
  } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      fullName: name,
      email: email,
    },
  });
  const username = watch('username');
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { functions, messages } = validators;

  const dispatch = useDispatch();

  useEffect(() => {
    trigger('password');
    document.getElementById('username')?.focus();
  }, []);

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
            label="Username/Email ID"
            id="email"
            disabled
          />
        </div>
        <div className="row right-align">
          <Link className="link" to="/auth/login">
            Not you?
          </Link>
        </div>
        <div className="row">
          <LabeledInput
            placeHolder="Enter your username"
            label="Username"
            id="username"
            type="text"
            error={
              errors['username']?.message !== ''
                ? errors['username']?.message
                : undefined
            }
            refFun={register({
              required: true,
              pattern: {
                value: /^[a-z0-9]+$/i,
                message: 'Invalid Username',
              },
              validate: async (value) => {
                if (!username) return true;
                if (value === username) return true;
                return new Promise((resolve) => {
                  debounce(async (username) => {
                    const { data } = await request(
                      'GET',
                      apiCheckUsername(username),
                    );
                    let message: string | boolean = true;
                    if (!data) {
                      message = 'Username Already Taken';
                      setError('username', { message });
                    } else {
                      clearErrors('username');
                    }
                    resolve(message);
                  }, 500)(value);
                });
              },
            })}
          />
          <span className="hint">
            This your unique CLEEN ID and is used to log in to the App.
            Alpha-numeric characters only.
          </span>
        </div>
        <div className="row">
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
                  style={
                    errors.password?.types && errors.password?.types[item]
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
            Register
          </Button>
        </div>
      </form>
      {/* <Terms /> */}
    </Card>
  );
};

export default Register;
