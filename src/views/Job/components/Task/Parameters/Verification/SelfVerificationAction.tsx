import { Button, TextInput } from '#components';
import { InputTypes } from '#utils/globalTypes';
import { jobActions } from '#views/Job/jobStore';
import { Visibility } from '@material-ui/icons';
import React, { FC, memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

type Inputs = {
  password: string;
};

const SelfVerificationAction: FC<{ parameterId: string }> = ({ parameterId }) => {
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
      jobActions.completeSelfVerification({
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
        type={passwordInputType ? InputTypes.PASSWORD : InputTypes.SINGLE_LINE}
      />
      <Button style={{ marginRight: 'unset' }} type="submit" disabled={!isValid || !isDirty}>
        Verify
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          dispatch(jobActions.recallPeerVerification({ parameterId, type: 'self' }));
        }}
      >
        Cancel
      </Button>
    </form>
  );
};

export default memo(SelfVerificationAction);
