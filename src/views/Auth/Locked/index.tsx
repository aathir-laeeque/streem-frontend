import React, { FC, useState } from 'react';
import { LabeledInput, Button, Terms, Card } from '#components';
import { LockedProps } from './types';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import { useForm } from 'react-hook-form';

type Inputs = {
  username: string;
  password: string;
};

const Locked: FC<LockedProps> = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [passwordInputType, setPasswordInputType] = useState(true);

  const onSubmit = (data: Inputs) => {
    console.log('Inputs', data);
  };

  return (
    <Card
      heading="Account Access Locked!"
      subHeading="You account has been locked due to 3 failed login attempts. Please
    contact your administrator to regain access, or wait for 30 minutes
    before you retry."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <LabeledInput
            refFun={register({
              required: true,
            })}
            placeHolder="Enter your email or employee ID"
            label="Email/Employee ID"
            id="username"
            disabled
          />
        </div>
        <div className="row" style={{ padding: '24px 12px 8px' }}>
          <LabeledInput
            placeHolder="Password"
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
              required: true,
            })}
            disabled
          />
        </div>
        <div className="row right-align">
          <Link className="link" to="/auth/forgot">
            Forgot password?
          </Link>
        </div>
        <div className="row" style={{ paddingTop: '20px' }}>
          <Button className="primary-button" type="submit" disabled>
            Login
          </Button>
        </div>
      </form>
      <Terms />
    </Card>
  );
};

export default Locked;
