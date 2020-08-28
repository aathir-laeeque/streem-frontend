import React, { FC } from 'react';
import { useTypedSelector } from '#store';
import { LabeledInput, Button, Terms, Card } from '#components';
import { CheckCircleOutline } from '@material-ui/icons';
import { ForgotProps } from './types';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../actions';
import { navigate } from '@reach/router';
import { useForm } from 'react-hook-form';

type Inputs = {
  email: string;
};

const Forgot: FC<ForgotProps> = () => {
  const { resetRequested } = useTypedSelector((state) => state.auth);
  const { register, handleSubmit } = useForm<Inputs>();

  const dispatch = useDispatch();

  const onSubmit = (data: Inputs) => {
    const { email } = data;
    dispatch(
      forgotPassword({
        email: email.toString(),
      }),
    );
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Card
      heading={
        resetRequested ? 'Password Reset Email Sent' : 'Reset Your Password'
      }
      subHeading={
        resetRequested
          ? 'We’ve sent an email to marcelino.langworth@yahoo.com to reset your password.'
          : 'Enter your Email ID registered with us below and we’ll send you a link to reset your password.'
      }
    >
      {resetRequested ? (
        <CheckCircleOutline
          style={{
            color: '#5aa700',
            fontSize: '144px',
            alignSelf: 'center',
            margin: '24px 0px 20px 0px',
          }}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <LabeledInput
              refFun={register({
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeHolder="Enter your Email ID"
              label="Email ID"
              id="email"
              // error="This email ID doesn’t exist in our system. Please make sure it is correctly entered."
            />
          </div>
          <div className="row" style={{ paddingTop: '20px' }}>
            <Button className="primary-button" type="submit">
              Reset Password
            </Button>
          </div>
          <div className="row center-align">
            <a className="link" onClick={goBack}>
              Go Back
            </a>
          </div>
        </form>
      )}
      {/* <Terms /> */}
    </Card>
  );
};

export default Forgot;
