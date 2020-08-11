import React, { FC, useEffect, useState } from 'react';
import { LabeledInput, Button } from '#components';
import { RegisterProps } from './types';
import styled from 'styled-components';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import { useForm, ValidationRules } from 'react-hook-form';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .card {
    width: 75%;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: #fff;
    padding: 28px 28px 20px 28px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2),
      0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 3px 4px 0 rgba(0, 0, 0, 0.14);

    .row {
      padding: 12px;
    }

    .right-align {
      display: flex;
      justify-content: flex-end;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
    }

    .heading {
      font-size: 16px;
      font-weight: 600;
      color: #666666;
    }

    .terms {
      color: #999999;
      font-size: 16px;
      letter-spacing: 0.15px;
      padding-bottom: 0px;
      text-align: center;
    }

    .link {
      color: #1d84ff;
      text-decoration: unset;
    }

    .primary-button {
      margin-right: 0px;
      flex: 1;
      display: flex;
      font-size: 20px;
      width: 100%;
      justify-content: center;
      line-height: 1;
      background-color: #1d84ff;
    }

    .error-container {
      display: flex;
      flex-wrap: wrap;

      > div {
        display: flex;
        flex: 0 50%;
        width: 100%;
        font-size: 14px;
        line-height: 19px;
        color: #666666;
        align-items: center;

        .indicator {
          width: 7px;
          height: 7px;
          margin-right: 6px;
          border-radius: 4px;
          background-color: #5aa700;
          display: inline-block;
        }
      }
    }
  }
`;

type Inputs = {
  fullName: string;
  username: string;
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
const Register: FC<RegisterProps> = ({ name, email }) => {
  const { register, handleSubmit, trigger, errors } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      fullName: name,
      username: email,
    },
  });
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { functions, messages } = validators;

  useEffect(() => {
    trigger('password');
  }, []);

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
  };

  return (
    <Wrapper>
      <div className="card">
        <span className="row title">Welcome to STREEM!</span>
        <span className="row heading">
          Set a new password for your account.
        </span>
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
              label="Username/Employee ID"
              id="username"
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
        <span className="row terms">
          Some text which can explain about <a href="#">terms & conditions</a>,
          if any
        </span>
      </div>
    </Wrapper>
  );
};

export default Register;
