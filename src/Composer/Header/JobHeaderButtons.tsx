import { Button, Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { apiGetAssignedUsersForJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Job } from '#views/Jobs/types';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from '@reach/router';

import { completeJob, getSignOffStatus } from '../actions';
import { JobStatus } from '../composer.types';

const JobHeaderButtons: FC = () => {
  const { jobStatus, data } = useTypedSelector((state) => state.composer);

  const { profile } = useTypedSelector((state) => state.auth);

  const location = useLocation();

  const [isLoggedInUserAssigned, setIsLoggedInUserAssigned] = useState(false);

  const { id: jobId, code, checklist: { name } = {} } = (data as Job) ?? {};

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget);

  const showBulkAssignButton =
    jobStatus !== JobStatus.COMPLETED &&
    jobStatus !== JobStatus.COMPLETED_WITH_EXCEPTION &&
    location.pathname.split('/')[1] !== 'inbox';

  useEffect(() => {
    (async () => {
      if (jobId) {
        const { data, errors } = await request(
          'GET',
          apiGetAssignedUsersForJob(jobId),
        );

        if (data) {
          setIsLoggedInUserAssigned(
            data.some((user) => user.id === profile?.id),
          );
        } else {
          console.error(
            'error came in fetch assigned users from component :: ',
            errors,
          );
        }
      }
    })();
  }, [jobId]);

  return (
    <div className="buttons-container">
      {jobStatus === JobStatus.INPROGRESS ? (
        <>
          <Button1
            className="sign-off"
            color="blue"
            variant="secondary"
            onClick={() =>
              dispatch(
                getSignOffStatus({
                  jobId,
                  allowSignOff: isLoggedInUserAssigned,
                }),
              )
            }
          >
            {isLoggedInUserAssigned ? 'Sign Completed Task' : 'Sign Off Status'}
          </Button1>
        </>
      ) : null}

      <Button
        onClick={() => {
          window.open(`/jobs/print/${jobId}`, '_blank');
        }}
      >
        Print Job
      </Button>

      {showBulkAssignButton ? (
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
      ) : null}

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
