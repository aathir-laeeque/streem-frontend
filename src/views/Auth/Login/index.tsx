import React, { FC, useState } from 'react';
import { LabeledInput, Button } from '#components';
import { LoginProps } from './types';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { Visibility } from '@material-ui/icons';
import { useForm } from 'react-hook-form';

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
  username: string;
  password: string;
};

const Login: FC<LoginProps> = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [passwordInputType, setPasswordInputType] = useState(true);

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
  };

  return (
    <Wrapper>
      <div className="card">
        <span className="row title">Welcome to STREEM!</span>
        <span className="row heading">Enter your credentials to login.</span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <LabeledInput
              refFun={register({
                required: true,
              })}
              placeHolder="Enter your username or employee ID"
              label="Username/Employee ID"
              id="username"
            />
          </div>
          <div className="row" style={{ padding: '24px 12px 8px' }}>
            <LabeledInput
              placeHolder="Password"
              label="Password"
              id="password"
              error="Invalid Password"
              type={passwordInputType ? 'password' : 'text'}
              icon={
                <Visibility
                  onClick={() => setPasswordInputType(!passwordInputType)}
                  style={{ color: '#999999' }}
                />
              }
              refFun={register({
                required: true,
              })}
            />
          </div>
          <div className="row right-align">
            <Link className="link" to="forgot">
              Forgot password?
            </Link>
          </div>
          <div className="row" style={{ paddingTop: '20px' }}>
            <Button className="primary-button" type="submit">
              Login
            </Button>
          </div>
        </form>
        <span className="row terms">
          Some text which can explain about{' '}
          <Link className="link" to="#">
            terms & conditions
          </Link>
          , if any
        </span>
      </div>
    </Wrapper>
  );
};

export default Login;
