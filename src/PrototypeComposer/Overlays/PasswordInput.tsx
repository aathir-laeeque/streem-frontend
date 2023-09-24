import { BaseModal, Button, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { releasePrototype, signOffPrototype } from '#PrototypeComposer/reviewer.actions';
import { Checklist } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { Visibility } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useMsal } from '@azure/msal-react';
import { UserType } from '#views/UserAccess/ManageUser/types';
import { InputTypes } from '#utils/globalTypes';

const Wrapper = styled.div`
  .modal {
    max-width: 368px !important;
    min-width: 300px !important;

    .close-icon {
      top: 22px !important;
      right: 16px !important;
      font-size: 24px !important;
    }

    h2 {
      color: #000 !important;
      font-weight: bold !important;
      font-size: 24px !important;
      line-height: 29px !important;
    }

    .modal-header {
      padding: 24px 24px 8px !important;
      border-bottom: none !important;
    }

    .modal-body {
      text-align: left;
      padding: 0px 24px 24px !important;
      display: flex;
      flex-direction: column;

      > span {
        font-size: 14px;
        color: #000;
        line-height: 19px;
      }

      form {
        margin-top: 24px;

        .input {
          .input-label {
            font-size: 12px;
          }

          .input-wrapper {
            border-color: transparent;
            border-bottom-color: #999999;
          }
        }

        button {
          width: 100%;
          margin-top: 40px;
          justify-content: center;
        }
      }
    }
  }
`;

type Inputs = {
  password: string;
};

const PasswordInputModal: FC<
  CommonOverlayProps<{
    isReleasing: boolean;
  }>
> = ({ closeAllOverlays, closeOverlay, props }) => {
  const isReleasing = props?.isReleasing || false;
  const dispatch = useDispatch();
  const { instance } = useMsal();
  const { data: checklist } = useTypedSelector((state) => ({
    approvers: state.prototypeComposer.approvers,
    data: state.prototypeComposer.data as Checklist,
  }));
  const { userType } = useTypedSelector((state) => state.auth);
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { register, handleSubmit, formState } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const { isDirty, isValid } = formState;

  const onSubmit = (data: Inputs) => {
    const _instance = userType === UserType.AZURE_AD ? instance : undefined;
    if (isReleasing) {
      dispatch(
        releasePrototype({
          checklistId: checklist.id,
          password: data.password,
          instance: _instance,
        }),
      );
    } else {
      dispatch(
        signOffPrototype({
          checklistId: checklist.id,
          password: data.password,
          instance: _instance,
        }),
      );
    }
  };

  const AfterIcon = () => (
    <Visibility
      onClick={() => setPasswordInputType(!passwordInputType)}
      style={{ color: passwordInputType ? '#000' : '#1d84ff' }}
    />
  );

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showFooter={false}
        title="Ready for Release"
      >
        <div>
          By Entering you Account Password and Approving it, you will Release the Process from your
          end.
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {userType === UserType.LOCAL && (
            <TextInput
              ref={register({
                required: true,
              })}
              AfterElement={AfterIcon}
              name="password"
              label="Password"
              placeholder="Password"
              error={true}
              type={passwordInputType ? InputTypes.PASSWORD : InputTypes.SINGLE_LINE}
            />
          )}
          <Button
            type="submit"
            disabled={userType === UserType.LOCAL ? !isValid || !isDirty : false}
          >
            Approve
          </Button>
        </form>
      </BaseModal>
    </Wrapper>
  );
};

export default PasswordInputModal;
