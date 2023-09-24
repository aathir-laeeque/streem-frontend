import { Button, TextInput } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { InputTypes } from '#utils/globalTypes';
import { jobActions } from '#views/Job/jobStore';
import { Visibility } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

type Inputs = {
  password: string;
};

const PeerVerificationAction: FC<{ parameterId: string }> = ({ parameterId }) => {
  const [showPasswordField, setShowPasswordField] = useState(false);
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
      jobActions.acceptPeerVerification({
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
    <>
      {showPasswordField ? (
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
              setShowPasswordField(false);
            }}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className="parameter-verification">
          <Button
            onClick={() => {
              setShowPasswordField(true);
            }}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            color="red"
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.REASON_MODAL,
                  props: {
                    modalTitle: 'Reject Verification',
                    modalDesc: 'Provide reason for rejection',
                    onSubmitHandler: (reason: string) =>
                      dispatch(jobActions.rejectPeerVerification({ parameterId, comment: reason })),
                  },
                }),
              );
            }}
          >
            Reject
          </Button>
        </div>
      )}
    </>
  );
};

export default PeerVerificationAction;
