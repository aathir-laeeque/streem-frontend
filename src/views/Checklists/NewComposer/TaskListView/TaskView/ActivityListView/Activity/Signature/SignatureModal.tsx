import { Button, FlatButton, BaseModal } from '#components';
import React, { FC, useRef, useEffect } from 'react';
import { Close } from '@material-ui/icons';
import SignatureCanvas from 'react-signature-canvas';
import styled from 'styled-components';

interface SignatureModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  user: { id: string; name: string };
  onAcceptSignature: (imageData: string) => void;
}

const Wrapper = styled.div.attrs({})`
  .sign-modal-header {
    display: flex;
    align-items: center;
    padding: 7px 32px 15px;
    margin: 0px -15px;
    justify-content: space-between;
    border-bottom: 1px dashed #e0e0e0;

    > .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > span {
        font-size: 20px;
        font-weight: bold;
        line-height: 0.8;
        color: #161616;
      }

      > .top-right {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        > span {
          font-size: 14px;
          color: #4f4f4f;
          text-align: right;
        }
      }
    }
  }

  .sign-modal-body {
    padding: 40px 33px;
    height: 350px;

    canvas {
      border-radius: 4px;
    }
  }

  .sign-modal-footer-buttons {
    display: flex;
    justify-content: space-between;
    padding: 0px 30px 10px;
  }
`;

export const SignatureModal: FC<SignatureModalProps> = ({
  closeAllModals,
  closeModal,
  user,
  onAcceptSignature,
}) => {
  const canvasRef = useRef<any | null>(null);

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas = canvasRef.current.getCanvas();
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.backgroundColor = '#fafafa';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  const onSuccess = () => {
    const canvas = canvasRef.current.getCanvas();
    onAcceptSignature(canvas.toDataURL());
    closeModal();
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        showHeader={false}
        showFooter={false}
        isRound={false}
      >
        <div className="sign-modal-header">
          <div className="header">
            <span>Signature</span>
            <div className="top-right">
              <span>{user.name}</span>
              <span>ID: {user.id}</span>
            </div>
          </div>
          <Close
            style={{ cursor: `pointer`, fontSize: 20, alignSelf: 'flex-start' }}
            onClick={closeModal}
          />
        </div>
        <div className="sign-modal-body">
          <SignatureCanvas ref={canvasRef} backgroundColor="#fafafa" />
        </div>
        <div className="sign-modal-footer-buttons">
          <FlatButton
            style={{
              padding: `5px 16px`,
              fontWeight: 600,
              border: '1px solid #eb5757',
              color: '#eb5757',
            }}
            onClick={closeModal}
          >
            Cancel
          </FlatButton>
          <Button
            style={{ marginRight: 0, fontWeight: 600 }}
            onClick={onSuccess}
          >
            Accept Signature
          </Button>
        </div>
      </BaseModal>
    </Wrapper>
  );
};