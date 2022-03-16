import { BaseModal, Button1, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { fetch } from '#store/properties/actions';
import { VisibilityOutlined } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout, reLogin } from '../actions';

// TODO Handle closing of this modal if relogin api fails for some reason.
const Wrapper = styled.div`
  .modal {
    max-width: 468px !important;
    min-width: 300px !important;

    .close-icon {
      display: none !important;
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
        line-height: 1.33;
        letter-spacing: 0.32px;
        text-align: left;
        color: #999999;
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

const SessionExpireModal: FC<CommonOverlayProps<unknown>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  const dispatch = useDispatch();
  const { profile, selectedUseCase } = useTypedSelector((state) => state.auth);
  const [passwordInputType, setPasswordInputType] = useState(true);
  const { register, handleSubmit, formState } = useForm<Inputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Inputs) => {
    if (profile && profile.username) {
      dispatch(
        reLogin({
          ...data,
          username: profile.username,
        }),
      );

      if (selectedUseCase) {
        dispatch(
          fetch(
            [ComposerEntity.JOB, ComposerEntity.CHECKLIST],
            selectedUseCase.id,
          ),
        );
      }
      closeOverlay();
    }
  };

  const AfterIcon = () => (
    <VisibilityOutlined
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
        title="Session Expired!"
        allowCloseOnOutsideClick={false}
      >
        <span>
          Your current session has expired. You may continue by entering your
          account password.
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
          <div style={{ display: 'flex' }}>
            <Button1
              style={{ width: 'auto' }}
              variant="secondary"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </Button1>
            <Button1
              type="submit"
              style={{ marginLeft: 'auto', width: 'auto' }}
              disabled={!formState.isValid || !formState.isDirty}
            >
              Proceed to Login
            </Button1>
          </div>
        </form>
      </BaseModal>
    </Wrapper>
  );
};

export default SessionExpireModal;
