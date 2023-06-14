import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Job } from '#views/Jobs/ListView/types';
import React, { FC } from 'react';
import styled from 'styled-components';
import VerificationsContent from '#views/Inbox/ListView/VerificationsContent';
import backIcon from '#assets/svg/back-icon.svg';

const Wrapper = styled.div`
  .modal {
    height: 100vh;
    min-width: 100vw !important;
  }

  .modal-body {
    height: 100%;
  }

  .back-icon-text {
    font-size: 14px;
    display: flex;
    gap: 22px;
    align-items: center;
    cursor: pointer;
  }
`;

const GoBackToTask = (onClick: any) => {
  return (
    <div onClick={onClick} className="back-icon-text">
      <img src={backIcon} alt="icon"></img>
      Back to Task
    </div>
  );
};

const JobVerification: FC<
  CommonOverlayProps<{
    jobId?: Job['id'];
    userId?: string;
    redirectedFromBanner?: boolean;
  }>
> = ({ closeAllOverlays, closeOverlay, props: { jobId, userId, redirectedFromBanner } }) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={true}
        title={GoBackToTask(closeOverlay)}
        showFooter={false}
        showCloseIcon={true}
      >
        <VerificationsContent values={{ userId, jobId, isJobOpen: true, redirectedFromBanner }} />
      </BaseModal>
    </Wrapper>
  );
};

export default JobVerification;
