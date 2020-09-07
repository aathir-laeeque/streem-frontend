import { Button } from '#components';
import { useTypedSelector } from '#store/helpers';
import { ArrowDropDown } from '@material-ui/icons';
import React, { FC, useState, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, MenuItem } from '@material-ui/core';

import { completeJob, publishChecklist, startJob } from '../actions';
import { Entity, JobStatus } from '../types';
import Wrapper from './styles';
import { openModalAction } from '../../components/ModalContainer/actions';
import { ModalNames } from '../../components/ModalContainer/types';

const JobButtons: FC = () => {
  const { entityId: jobId, jobStatus } = useTypedSelector(
    (state) => state.composer,
  );

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="buttons-container">
      <Button
        onClick={() => {
          window.open(`print/${jobId}`, '_blank');
        }}
      >
        Print Job
      </Button>

      {jobStatus === JobStatus.ASSIGNED ? (
        <Button onClick={() => dispatch(startJob(jobId))}>Start Job</Button>
      ) : null}

      {jobStatus === JobStatus.INPROGRESS ? (
        <div className="dropdown-button">
          <Button onClick={() => dispatch(completeJob())}>Complete Job</Button>
          <div onClick={handleClick} className="drop-menu">
            <ArrowDropDown className="icon" />
          </div>
          <Menu
            id="complete-job"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: 30 }}
          >
            <MenuItem
              onClick={() => {
                dispatch(
                  openModalAction({
                    type: ModalNames.COMPLETE_JOB_WITH_EXCEPTION,
                    props: {},
                  }),
                );
                handleClose();
              }}
            >
              Complet Job with exception
            </MenuItem>
          </Menu>
        </div>
      ) : null}
    </div>
  );
};

const Header: FC = () => {
  const { entity } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  const isChecklsit = entity === Entity.CHECKLIST;

  return (
    <Wrapper>
      <div className="header-item">Stages</div>

      <span className="auto-save-text">All changes saved</span>

      {isChecklsit ? (
        <Button onClick={() => dispatch(publishChecklist())}>
          Publish Checklist
        </Button>
      ) : (
        <JobButtons />
      )}
    </Wrapper>
  );
};

export default Header;
