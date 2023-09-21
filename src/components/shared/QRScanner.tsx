import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import styled from 'styled-components';

const Wrapper = styled.div`
  #modal-container {
    z-index: 1301 !important;
    .modal {
      min-height: 100dvh !important;
      min-width: 100dvw !important;

      .close-icon {
        font-size: 32px !important;
        color: #fff !important;
        z-index: 10 !important;
      }

      &-body {
        padding: 0 !important;
        .video-container {
          min-height: 100dvh;
          min-width: 100dvw;
          line-height: 0;
          position: relative;
          overflow: hidden;

          .scan-region-highlight {
            outline: rgba(0, 0, 0, 0.5) solid 50vmax;
            .scan-region-highlight-svg {
              stroke: #64a2f3 !important;
              stroke-width: 8 !important;
              width: 126% !important;
              height: 126% !important;
              left: -13% !important;
              top: -13% !important;
            }
            .code-outline-highlight {
              stroke: rgba(255, 255, 255, 0.8) !important;
              stroke-width: 15 !important;
              stroke-dasharray: none !important;
            }
          }

          video {
            height: 100dvh;
            width: 100%;
            object-fit: cover;
          }
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
  props: { onSuccess },
}) => {
  const scanner = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const foundResult = useRef(false);

  const setResult = (result: any) => {
    if (!foundResult.current) {
      foundResult.current = true;
      setTimeout(() => {
        onSuccess(result);
        closeOverlay();
      }, 700);
    }
  };

  useEffect(() => {
    if (!scanner.current && videoRef.current) {
      scanner.current = new QrScanner(videoRef.current, setResult, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        calculateScanRegion: (v) => {
          const smallestDimension = Math.min(v.videoWidth, v.videoHeight);

          // Make scan region smaller to match better small qr codes
          const scanRegionSize = Math.round((1 / 4) * smallestDimension);

          let region: QrScanner.ScanRegion = {
            x: Math.round((v.videoWidth - scanRegionSize) / 2),
            y: Math.round((v.videoHeight - scanRegionSize) / 2),
            width: scanRegionSize,
            height: scanRegionSize,
          };
          return region;
        },
      });
      scanner.current.start();
    }
    return () => {
      scanner.current?.stop();
      scanner.current?.destroy();
    };
  }, []);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="video-container">
          <video id="qr-video" ref={videoRef}></video>
        </div>
      </BaseModal>
    </Wrapper>
  );
};
