import { Button, Card, LabeledInput } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { useTypedSelector } from '#store';
import { ValidatorProps } from '#utils/globalTypes';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { login, resetError } from '../actions';
import { LoginProps } from './types';

type Inputs = {
  username: string;
  password: string;
};

const Login: FC<LoginProps> = (props) => {
  const dispatch = useDispatch();
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { error } = useTypedSelector((state) => state.auth);

  const { register, handleSubmit } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const validators: ValidatorProps = {
    common: {
      functions: {
        resetError: (value: string) => {
          error && dispatch(resetError());
          return true;
        },
      },
      messages: {},
    },
  };

  const onSubmit = (data: Inputs) => {
    dispatch(login(data));
  };

  useEffect(() => {
    console.log('tokenRevoked', props['*']);
    document.getElementById('username')?.focus();
    if (props['*'] && props['*'] === 'login/tokenRevoked')
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: 'Your Token has been Revoked.',
        }),
      );
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
              validate: validators['common'].functions,
            })}
            error={error ? '' : undefined}
            placeHolder="Enter your Username or Email ID"
            label="Username/Email ID"
            id="username"
          />
        </div>
        <div className="row" style={{ padding: '24px 12px 8px' }}>
          <LabeledInput
            placeHolder="Password"
            label="Password"
            id="password"
            error={error ? '' : undefined}
            type={passwordInputType ? 'password' : 'text'}
            icon={
              <Visibility
                onClick={() => setPasswordInputType(!passwordInputType)}
                style={{ color: passwordInputType ? '#999999' : '#1d84ff' }}
              />
            }
            refFun={register({
              required: true,
              validate: validators['common'].functions,
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
