import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';

type Props = {
  id: string;
  title: string;
  onPrimary: () => void;
  secondaryText?: string;
  primaryText: string;
  data: any;
};

const QRGeneratorWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const QRGenerator: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { id, title, onPrimary, data, primaryText, secondaryText = 'Cancel' },
}) => {
  return (
    <BaseModal
      title={title}
      onPrimary={onPrimary}
      onSecondary={closeOverlay}
      closeAllModals={closeAllOverlays}
      closeModal={closeOverlay}
      primaryText={primaryText}
      secondaryText={secondaryText}
    >
      <QRGeneratorWrapper>
        <QRCode id={id} value={typeof data === 'string' ? data : JSON.stringify(data)} />
      </QRGeneratorWrapper>
    </BaseModal>
  );
};
