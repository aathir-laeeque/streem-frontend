import { BaseModal } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';
import { QrReader } from 'react-qr-reader';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useDispatch } from 'react-redux';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';

const ViewFinder = () => (
  <>
    <span
      style={{
        top: '30vh',
        left: 'calc(50vw - 6ch)',
        zIndex: 2,
        position: 'absolute',
        color: '#FFF',
        fontSize: '20px',
        fontWeight: 600,
      }}
    >
      Scan QR Code
    </span>
    <div
      style={{
        top: 0,
        left: 0,
        zIndex: 1,
        boxSizing: 'border-box',
        borderInline: '40vw solid rgba(0, 0, 0, 0.72)',
        borderBlock: '40vh solid rgba(0, 0, 0, 0.72)',
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          top: -17,
          left: -17,
          zIndex: 1,
          boxSizing: 'border-box',
          outline: '4px solid #1d84ff',
          position: 'absolute',
          width: 'calc(100% + 34px)',
          height: 'calc(100% + 34px)',
        }}
      ></div>
    </div>
  </>
);

const Wrapper = styled.div`
  .modal {
    min-height: 100vh !important;
    min-width: 100vw !important;

    .close-icon {
      font-size: 32px !important;
      color: #fff !important;
      z-index: 10 !important;
    }

    &-body {
      > section {
        > div {
          padding-top: unset !important;
          position: unset !important;
        }
      }
    }
  }
`;

type Props = {
  header?: string;
  onSuccess: (data: any) => void;
};

export const QRScanner: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { header, onSuccess },
}) => {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <QrReader
          constraints={{ facingMode: { ideal: 'environment' } }}
          videoId="video"
          scanDelay={500}
          ViewFinder={ViewFinder}
          onResult={(result, error) => {
            if (!!result) {
              onSuccess(result?.getText());
              closeOverlay();
            }

            if (!!error) {
              if (error.message) {
                console.log(error.message);
                dispatch(
                  showNotification({
                    type: NotificationType.ERROR,
                    msg: error.message,
                  }),
                );
                closeOverlay();
              }
            }
          }}
        />
      </BaseModal>
    </Wrapper>
  );
};
