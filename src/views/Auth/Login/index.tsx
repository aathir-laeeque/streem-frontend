import { Button, Card, LabeledInput } from '#components';
import { useTypedSelector } from '#store';
import { ValidatorProps } from '#utils/globalTypes';
import { Visibility } from '@material-ui/icons';
import { Link } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { login, resetError } from '../actions';
import { LoginProps } from './types';

type Inputs = {
  username: string;
  password: string;
};

const Login: FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { error, loading } = useTypedSelector((state) => state.auth);
  const { t: translate } = useTranslation(['userManagement']);

  const { register, handleSubmit } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const validators: Record<string, ValidatorProps> = {
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
    document.getElementById('username')?.focus();
  }, []);

  return (
    <Card
      heading={translate('userManagement:login.heading')}
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
          <Button className="primary-button" type="submit" disabled={loading}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
