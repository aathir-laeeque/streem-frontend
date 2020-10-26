import { BaseModal, Button1, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Visibility } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

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

const PasswordInputModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { register, handleSubmit, formState, errors } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Inputs) => {
    // dispatch(login(data));
    console.log('data', data);
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
        <span>
          By Entering you Account Password and Approving it, you will Release
          the Checklist from your end.
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            ref={register({
              required: true,
            })}
            AfterElement={AfterIcon}
            name="password"
            label="Password"
            placeholder="Password"
            error={true}
            type={passwordInputType ? 'password' : 'text'}
          />
          <Button1
            type="submit"
            disabled={formState.isValid && formState.isDirty ? false : true}
          >
            Approve
          </Button1>
        </form>
      </BaseModal>
    </Wrapper>
  );
};

export default PasswordInputModal;