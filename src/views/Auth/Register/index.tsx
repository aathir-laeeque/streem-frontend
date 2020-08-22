import React, { FC, useEffect, useState } from 'react';
import { LabeledInput, Button, Terms, Card } from '#components';
import { RegisterProps } from './types';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '../actions';
import { useForm, ValidationRules } from 'react-hook-form';

type Inputs = {
  fullName: string;
  email: string;
  password: string;
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
  const { register, handleSubmit, trigger, errors } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      fullName: name,
      email: email,
    },
  });
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { functions, messages } = validators;

  const dispatch = useDispatch();

  useEffect(() => {
    trigger('password');
  }, []);

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
    const { email, password } = data;
    if (token) {
      dispatch(
        registerAction({
          email: email.toString(),
          newPassword: password.toString(),
          token: token.toString(),
        }),
      );
    }
  };

  return (
    <Card
      heading="Welcome to STREEM!"
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
            placeHolder="troypeters@example.net"
            label="Email/Employee ID"
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
            placeHolder="Enter your password"
            label="Password"
            id="password"
            type={passwordInputType ? 'password' : 'text'}
            icon={
              <Visibility
                onClick={() => setPasswordInputType(!passwordInputType)}
                style={{ color: '#999999' }}
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
      <Terms />
    </Card>
  );
};

export default Register;
