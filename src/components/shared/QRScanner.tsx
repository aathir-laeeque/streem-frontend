import { BaseModal } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';
import { QrReader } from 'react-qr-reader';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useDispatch } from 'react-redux';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';

const ViewFinderWrapper = styled.div`
  .label {
    top: calc(50vh - 200px);
    left: calc(50vw - 6ch);
    z-index: 2;
    position: absolute;
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: 600;
  }

  .overlay {
    top: 0px;
    left: 0px;
    z-index: 1;
    box-sizing: border-box;
    border-inline: calc(50vw - 300px) solid rgba(0, 0, 0, 0.72);
    border-block: calc(50vh - 300px) solid rgba(0, 0, 0, 0.72);
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .quiet-zone {
    top: -10%;
    left: -10%;
    z-index: 1;
    box-sizing: border-box;
    position: absolute;
    width: 120%;
    height: 120%;
    border: rgb(29, 132, 255) solid 4px;
    border-radius: 15px;
  }
`;

const ViewFinder = () => (
  <ViewFinderWrapper>
    <span className="label">Scan QR Code</span>
    <div className="overlay">
      <div className="quiet-zone" />
    </div>
  </ViewFinderWrapper>
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
