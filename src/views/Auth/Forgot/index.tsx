import React, { FC, useState, useEffect } from 'react';
import { useTypedSelector } from '#store';
import { LabeledInput, Button, Card } from '#components';
import { CheckCircleOutline } from '@material-ui/icons';
import { ForgotProps } from './types';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../actions';
import { navigate } from '@reach/router';
import { useForm } from 'react-hook-form';

type Inputs = {
  email: string;
};

type StateType = {
  emailSentTo: string;
  resetRequested: boolean;
};

const Forgot: FC<ForgotProps> = () => {
  const { register, handleSubmit, errors, formState } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const { loading } = useTypedSelector((state) => state.auth);

  const [state, setState] = useState<StateType>({
    emailSentTo: '',
    resetRequested: false,
  });
  const { emailSentTo, resetRequested } = state;

  const dispatch = useDispatch();

  useEffect(() => {
    document.getElementById('email')?.focus();
  }, []);

  const onSubmit = (data: Inputs) => {
    const { email } = data;
    setState({ emailSentTo: email, resetRequested: true });
    dispatch(
      forgotPassword({
        email: email.toString(),
      }),
    );
  };

  const goBack = () => {
    navigate('/auth/login');
  };

  return (
    <Card
      heading={
        resetRequested ? 'Password Reset Email Sent' : 'Reset Your Password'
      }
      subHeading={
        resetRequested
          ? `You will receive password reset instructions if ${emailSentTo} is registered with us.`
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
              error={errors?.['email']?.message}
            />
          </div>
          <div className="row" style={{ paddingTop: '20px' }}>
            <Button
              className="primary-button"
              type="submit"
              disabled={!formState.isValid || !formState.isDirty || loading}
            >
              Reset Password
            </Button>
          </div>
        </form>
      )}
      <div className="row center-align">
        <a className="link" onClick={goBack}>
          Go Back
        </a>
      </div>
    </Card>
  );
};

export default Forgot;
