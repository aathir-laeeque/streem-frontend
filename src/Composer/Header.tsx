import { Button } from '#components';
import { useTypedSelector } from '#store/helpers';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ArrowDropDown } from '@material-ui/icons';

import { completeJob, startJob, publishChecklist } from './actions';
import { Entity, JobStatus } from './types';

const Wrapper = styled.div`
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  grid-area: header;
  z-index: 1;

  .header-item {
    font-size: 16px;
    font-weight: 600;
    line-height: 0.75;
    color: #1d84ff;
    border-bottom: 2px solid #1d84ff;
    padding: 18px 32px;
  }

  .auto-save-text {
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    line-height: 0.75;
    margin-left: auto;
    margin-right: 16px;
    visibility: hidden;
  }

  .dropdown-button {
    align-items: center;
    background-color: #1d84ff;
    border-radius: 4px;
    display: flex;
    margin-right: 8px;

    button {
      margin-right: 0;
    }

    .drop-menu {
      border-left: 1px solid #005dcc;
      display: flex;
      padding: 4px;

      .icon {
        color: #ffffff;
      }
    }
  }
`;

const JobButton: FC<{ isJobStarted: boolean; jobStatus: JobStatus }> = ({
  isJobStarted,
  jobStatus,
}) => {
  const [isCompleteWithException, setIsCompleteWithException] = useState(false);

  const dispatch = useDispatch();

  if (jobStatus === JobStatus.ASSIGNED) {
    if (isJobStarted) {
      return (
        <div className="dropdown-button">
          <Button
            onClick={() => {
              dispatch(completeJob(isCompleteWithException));
            }}
          >
            {isCompleteWithException
              ? 'Complete with exception'
              : 'Complete Job'}
          </Button>
          <div
            onClick={() => setIsCompleteWithException(!isCompleteWithException)}
            className="drop-menu"
          >
            <ArrowDropDown className="icon" />
          </div>
        </div>
      );
    } else {
      return <Button onClick={() => dispatch(startJob())}>Start Job</Button>;
    }
  } else {
    return null;
  }
};

const Header: FC = () => {
  const { entity, isJobStarted, jobStatus } = useTypedSelector(
    (state) => state.composer,
  );

  const dispatch = useDispatch();

  const isEntityChecklist = entity === Entity.CHECKLIST;

  return (
    <Wrapper>
      <div className="header-item">Stages</div>

      <span className="auto-save-text">All changes saved</span>

      {isEntityChecklist ? (
        <Button onClick={() => dispatch(publishChecklist())}>
          Publish Checklist
        </Button>
      ) : (
        <JobButton isJobStarted={isJobStarted} jobStatus={jobStatus} />
      )}
    </Wrapper>
  );
};

export default Header;
