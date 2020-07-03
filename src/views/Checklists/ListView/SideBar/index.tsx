import { FlatButton, Button } from '#components';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Check } from '@material-ui/icons';
import { createJob } from '../../../Jobs/ListView/actions';
import { SideBarProps } from './types';

const SideBar: FC<SideBarProps> = ({
  sideBarOpen,
  closeNav,
  selectedChecklist,
  properties,
}) => {
  const dispatch = useDispatch();

  const toggleState = () => {
    closeNav();
    dispatch(
      openModalAction({
        type: ModalNames.CREATE_JOB_MODAL,
        props: {
          selectedChecklist: selectedChecklist,
          properties: properties,
          onCreateJob: onCreateJob,
        },
      }),
    );
  };

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: number; value: string }[] = [];
    let error = false;
    properties.every((property) => {
      if (property.name) {
        if (!jobDetails[property.name]) {
          if (property.mandatory) {
            error = true;
            return false;
          }
        } else {
          tempProperties.push({
            id: property.id,
            value: jobDetails[property.name],
          });
          return true;
        }
      }
    });
    if (!error && tempProperties && selectedChecklist) {
      const parsedProperties: { id: number; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
          checklistId: selectedChecklist.id,
        }),
      );
    }
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
      <div id="sideNav" className="sidenav">
        <div style={{ margin: 16 }}>
          <Button className="sidebar-button" onClick={toggleState}>
            Start A Job
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
    </div>
  );
};

export default SideBar;
