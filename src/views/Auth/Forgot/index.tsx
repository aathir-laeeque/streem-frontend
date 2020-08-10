import React, { FC } from 'react';
import { LabeledInput, Button } from '#components';
import { ForgotProps } from './types';
import styled from 'styled-components';
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

    .center-align {
      display: flex;
      font-size: 20px;
      justify-content: center;
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

    a {
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
  emailid: string;
};

const Forgot: FC<ForgotProps> = () => {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
  };

  return (
    <Wrapper>
      <div className="card">
        <span className="row title">Reset Your Password</span>
        <span className="row heading">
          Enter your Email ID registered with us below and we’ll send you a link
          to reset your password.
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <LabeledInput
              refFun={register({
                required: true,
              })}
              placeHolder="Enter your Email ID"
              label="Email ID"
              id="emailid"
              // error="This email ID doesn’t exist in our system. Please make sure it is correctly entered."
            />
          </div>
          <div className="row" style={{ paddingTop: '20px' }}>
            <Button className="primary-button" type="submit">
              Reset Password
            </Button>
          </div>
          <div className="row center-align">
            <a href="javascript:window.history.back()">Go Back</a>
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

export default Forgot;
