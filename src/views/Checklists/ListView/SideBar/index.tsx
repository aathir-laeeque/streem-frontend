import React, { FC, useState } from 'react';
import { FlatButton, Button, Modal, FloatInput } from '../../../../components';
import { Check } from '@material-ui/icons';

import { SideBarProps } from './types';

const SideBar: FC<SideBarProps> = ({
  sideBarOpen,
  closeNav,
  selectedChecklist,
}) => {
  const [taskDetails, setTaskDetails] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleState = () => {
    if (!isModalOpen) {
      closeNav();
    }
    setIsModalOpen(!isModalOpen);
  };

  const onInputChange = (id: string, value: string) => {
    const temp = { ...taskDetails };
    temp[id] = value;
    setTaskDetails(temp);
  };

  return (
    <div>
      {sideBarOpen && (
        <div
          onClick={sideBarOpen ? closeNav : () => false}
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      <div id="mySidenav" className="sidenav">
        <div style={{ margin: 16 }}>
          <Button className="sidebar-button" onClick={toggleState}>
            Start A Task
          </Button>
          <FlatButton className="sidebar-flat-button">
            Edit Checklist
          </FlatButton>
          <FlatButton className="sidebar-flat-button">View Activity</FlatButton>
          <div className="sidebar-sections">
            <div className="sidebar-heading">VERSIONING</div>
            <div className="space-between">
              <div style={{ flex: 1 }}>
                <div className="sidebar-title">Version no.</div>
                <div className="sidebar-subtitle">3</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="sidebar-title">Published on</div>
                <div className="sidebar-subtitle">13 May 2020</div>
              </div>
            </div>
            <div className="space-between">
              <div style={{ flex: 1 }}>
                <div className="sidebar-title">Created By</div>
                <div className="sidebar-subtitle">Lottie Carroll</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="sidebar-title">Created on</div>
                <div className="sidebar-subtitle">12 March 2020</div>
              </div>
            </div>
            <div className="sidebar-action">View Older Verisons</div>
          </div>
          <div className="sidebar-sections">
            <div className="sidebar-heading">REVIEWERS</div>
            <div className="space-between">
              <div className="sidebar-subtitle">Delia Gregory</div>
              <Check className="check-icon" />
            </div>
            <div className="space-between">
              <div className="sidebar-subtitle">Arthur Elliot</div>
              <Check className="check-icon" />
            </div>
            <div className="sidebar-action">+2 more</div>
          </div>
          <div className="sidebar-sections">
            <div className="sidebar-heading">APPROVERS</div>
            <div className="space-between">
              <div className="sidebar-subtitle">Delia Gregory</div>
              <Check className="check-icon" />
            </div>
            <div className="space-between">
              <div className="sidebar-subtitle">Arthur Elliot</div>
              <Check className="check-icon" />
            </div>
          </div>
          <div className="sidebar-sections">
            <div className="sidebar-heading">ADDITIONAL ACTIONS</div>
            <FlatButton className="sidebar-flat-button">
              Print Checklist
            </FlatButton>
            <FlatButton className="sidebar-flat-button danger">
              Delete Checklist
            </FlatButton>
          </div>
        </div>
      </div>
      {isModalOpen && selectedChecklist && (
        <Modal
          toggleState={toggleState}
          isModalOpen={isModalOpen}
          title="Creating a Task"
          successText="Create Task"
          cancelText="Cancel"
          modalFooterOptions={
            <span style={{ color: `#12aab3`, fontWeight: 600, fontSize: 12 }}>
              Schedule Task
            </span>
          }
        >
          <FloatInput
            placeHolder="Choose a Checklist"
            label="Checklist"
            value={`${selectedChecklist.code} ${selectedChecklist.name}`}
            id="checklistId"
            onChange={onInputChange}
            required
            disabled
          />
          <FloatInput
            placeHolder="Name of the product being cleand"
            label="Product Manufactured"
            id="productManufactured"
            value={taskDetails.productManufactured || ''}
            onChange={onInputChange}
            required
          />
          <FloatInput
            placeHolder="Batch No. of the manufactured Product"
            label="Batch Number"
            id="batchNo"
            value={taskDetails.batchNo || ''}
            onChange={onInputChange}
            required
          />
          <FloatInput
            placeHolder="Room ID for the Equipment"
            label="Room ID"
            id="roomId"
            value={taskDetails.roomId || ''}
            onChange={onInputChange}
          />
        </Modal>
      )}
    </div>
  );
};

export default SideBar;
