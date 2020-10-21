import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { completeJob } from '../actions';
import { JobStatus } from '../composer.types';
import { Job } from '#views/Jobs/types';

const JobHeaderButtons: FC = () => {
  const { jobStatus, data } = useTypedSelector((state) => state.composer);

  const { id: jobId, code, checklist: { name } = {} } = (data as Job) ?? {};

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget);

  return (
    <div className="buttons-container">
      <Button
        onClick={() => {
          window.open(`print/${jobId}`, '_blank');
        }}
      >
        Print Job
      </Button>

      <Button
        onClick={() => {
          dispatch(
            openOverlayAction({
              type: OverlayNames.TASK_USERS_ASSIGNMENT,
              props: {
                jobId,
                forAll: true,
              },
            }),
          );
        }}
      >
        Bulk Assign All Tasks
      </Button>

      {jobStatus === JobStatus.ASSIGNED ? (
        <Button
          onClick={() =>
            dispatch(
              openOverlayAction({
                type: OverlayNames.START_JOB_MODAL,
                props: { jobId },
              }),
            )
          }
        >
          Start Job
        </Button>
      ) : null}

      {jobStatus === JobStatus.INPROGRESS ? (
        <div className="dropdown-button">
          <Button onClick={() => dispatch(completeJob({ jobId }))}>
            Complete Job
          </Button>

          <div onClick={handleClick} className="drop-menu">
            <ArrowDropDown className="icon" />
          </div>

          <Menu
            id="complete-job"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: 40 }}
          >
            <MenuItem
              onClick={() => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.COMPLETE_JOB_WITH_EXCEPTION,
                    props: { jobId, code, name },
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

      {jobStatus === JobStatus.UNASSIGNED ? (
        <div className="dropdown-button">
          <Button
            onClick={() =>
              dispatch(
                openOverlayAction({
                  type: OverlayNames.COMPLETE_JOB_WITH_EXCEPTION,
                  props: { jobId, code, name },
                }),
              )
            }
          >
            Complete Job With Exception
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default JobHeaderButtons;
