import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Checklist } from '../types';
import { checklists } from '../../../../mocks/index';

const Wrapper = styled.div`
  .modal {
    min-width: 420px !important;
    width: 420px !important;
  }

  .modal-body {
    padding: 0 !important;
  }

  .close-icon {
    top: 24px !important;
    right: 32px !important;
  }

  .body {
    padding: 80px;

    .editing-disabled-icon {
      font-size: 120px;
    }

    .text {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      margin-top: 24px;
    }
  }
`;

type ChecklistInfoModalProps = {
  checklist: Checklist;
};

const ChecklistInfoModal: FC<CommonOverlayProps<ChecklistInfoModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { checklist } = {},
}) => (
  <Wrapper>
    <BaseModal
      closeAllModals={closeAllOverlays}
      closeModal={closeOverlay}
      showHeader={false}
      showFooter={false}
    >
      <div className="body">Chceklist Info Modal</div>
    </BaseModal>
  </Wrapper>
);

export default ChecklistInfoModal;
