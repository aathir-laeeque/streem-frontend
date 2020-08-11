import React, { FC, useState } from 'react';
import { LabeledInput, Button, Terms, Card } from '#components';
import { CheckCircleOutline } from '@material-ui/icons';
import { ForgotProps } from './types';
import { navigate } from '@reach/router';
import { useForm } from 'react-hook-form';

type Inputs = {
  emailid: string;
};

const Forgot: FC<ForgotProps> = () => {
  const [isSent, setIsSent] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
    setIsSent(true);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Card
      heading={isSent ? 'Password Reset Email Sent' : 'Reset Your Password'}
      subHeading={
        isSent
          ? 'We’ve sent an email to marcelino.langworth@yahoo.com to reset your password.'
          : 'Enter your Email ID registered with us below and we’ll send you a link to reset your password.'
      }
    >
      {isSent ? (
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
            <a className="link" onClick={goBack}>
              Go Back
            </a>
          </div>
        </form>
      )}
      <Terms />
    </Card>
  );
};

export default Forgot;
