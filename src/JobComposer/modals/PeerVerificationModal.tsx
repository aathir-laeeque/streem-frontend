import React, { FC, useEffect, useState } from 'react';
import { BaseModal, Button, Select } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import styled from 'styled-components';
import { User } from '#store/users/types';
import { useTypedSelector } from '#store';
import { request } from '#utils/request';
import { apiVerificationAssignees } from '#utils/apiUrls';

const Wrapper = styled.div.attrs({})`
  .modal {
    width: 406px;
  }
  .verification-modal-header {
    display: flex;
    align-items: center;
    padding: 7px 32px 15px;
    margin: 0px -15px;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;

    > .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-weight: 700;
      font-size: 14px;
    }
  }

  .verification-modal-body {
    padding: 16px 20px;
    height: 300px;
    display: flex;
    .react-custom-select {
      width: 100%;
    }
  }

  .verification-modal-footer-buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

type Props = {
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const PeerVerificationModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { onSubmit },
}) => {
  const {
    auth: { userId },
    composer: { entityId: jobId },
  } = useTypedSelector((state) => state);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [assigneeList, setAssigneeList] = useState<User[] | null>(null);

  useEffect(() => {
    fetchAssigneeList();
  }, []);

  const fetchAssigneeList = async () => {
    const { data } = await request('GET', apiVerificationAssignees(jobId!));
    setAssigneeList(data || []);
  };

  const onSubmitModal = async () => {
    if (selectedUser) {
      onSubmit(selectedUser);
    }
    closeOverlay();
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="verification-modal-header">
          <div className="header">Send For Verification</div>
        </div>
        <div className="verification-modal-body">
          <Select
            label="Request Verification From"
            options={
              assigneeList
                ?.filter((currentUser) => currentUser?.id !== userId)
                .map((user) => ({
                  value: user.id,
                  label: user?.firstName + ' ' + user?.lastName,
                  externalId: <div>&nbsp;(ID: {user?.employeeId})</div>,
                })) as any
            }
            onChange={(value) => setSelectedUser(value)}
            placeholder="Select User"
          />
        </div>
        <div className="verification-modal-footer-buttons">
          <Button variant="secondary" color="red" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button onClick={onSubmitModal}>Submit</Button>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default PeerVerificationModal;
