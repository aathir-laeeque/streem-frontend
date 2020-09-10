import { Button, Card, LabeledInput } from '#components';
import { useTypedSelector } from '#store';
import { ValidatorProps } from '#utils/globalTypes';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { login } from '../actions';
import { LoginProps } from './types';

type Inputs = {
  username: string;
  password: string;
};

const validators: ValidatorProps = {
  username: {
    functions: {
      smallLength: (value: string) => value.length > 2,
    },
    messages: {
      smallLength: '2 characters minimum',
    },
  },
  password: {
    functions: {
      checkStrongness: (value: string) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value,
        ),
    },
    messages: {
      checkStrongness:
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    },
  },
};

const Login: FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { error } = useTypedSelector((state) => state.auth);

  const { register, handleSubmit, errors } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Inputs) => {
    dispatch(login(data));
  };

  useEffect(() => {
    document.getElementById('username')?.focus();
  }, []);

  return (
    <Card
      heading="Welcome to CLEEN!"
      subHeading="Enter your credentials to login."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <LabeledInput
            refFun={register({
              required: true,
              // validate: validators['username'].functions,
            })}
            error={
              errors.username?.type
                ? validators['username'].messages[errors.username?.type]
                : error
                ? ''
                : undefined
            }
            placeHolder="Enter your username or Email ID"
            label="Username/Email ID"
            id="username"
          />
        </div>
        <div className="row" style={{ padding: '24px 12px 8px' }}>
          <LabeledInput
            placeHolder="Password"
            label="Password"
            id="password"
            error={
              errors.password?.type
                ? validators['password'].messages[errors.password?.type]
                : error
                ? ''
                : undefined
            }
            type={passwordInputType ? 'password' : 'text'}
            icon={
              <Visibility
                onClick={() => setPasswordInputType(!passwordInputType)}
                style={{ color: passwordInputType ? '#999999' : '#1d84ff' }}
              />
            }
            refFun={register({
              required: true,
              // validate: validators['password'].functions,
            })}
          />
        </div>
        <div className="row right-align">
          <Link className="link" to="forgot">
            Forgot password?
          </Link>
        </div>
        <div
          className="row"
          style={{
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {error && <span className="error-span">{error}</span>}
          <Button className="primary-button" type="submit">
            Login
          </Button>
        </div>
      </form>
      {/* <Terms /> */}
    </Card>
  );
};

export default Login;
