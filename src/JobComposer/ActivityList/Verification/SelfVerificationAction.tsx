import { Button, TextInput } from '#components';
import { Visibility } from '@material-ui/icons';
import React, { FC, memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { completeSelfVerification, recallPeerVerification } from '../actions';
import { useForm } from 'react-hook-form';
import { Parameter } from '#JobComposer/checklist.types';

type Inputs = {
  password: string;
};

const SelfVerificationAction: FC<{ parameterId: Parameter['id'] }> = ({ parameterId }) => {
  const [passwordInputType, setPasswordInputType] = useState(true);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Inputs) => {
    dispatch(
      completeSelfVerification({
        parameterId,
        password: data.password,
      }),
    );
  };

  const AfterIcon = () => (
    <Visibility
      onClick={() => setPasswordInputType(!passwordInputType)}
      style={{ color: passwordInputType ? '#000' : '#1d84ff' }}
    />
  );
  return (
    <form className="parameter-verification" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        AfterElement={AfterIcon}
        name="password"
        placeholder="Enter Your Account Password"
        ref={register({
          required: true,
        })}
        type={passwordInputType ? 'password' : 'text'}
      />
      <Button style={{ marginRight: 'unset' }} type="submit" disabled={!isValid || !isDirty}>
        Verify
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          dispatch(recallPeerVerification({ parameterId, type: 'self' }));
        }}
      >
        Cancel
      </Button>
    </form>
  );
};

export default memo(SelfVerificationAction);