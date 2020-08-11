import React, { FC, useState } from 'react';
import { LabeledInput, Button, Terms, Card } from '#components';
import { LoginProps } from './types';
import { Link } from '@reach/router';
import { Visibility } from '@material-ui/icons';
import { useForm } from 'react-hook-form';

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
    <Card
      heading="Welcome to STREEM!"
      subHeading="Enter your credentials to login."
    >
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
      <Terms />
    </Card>
  );
};

export default Login;
