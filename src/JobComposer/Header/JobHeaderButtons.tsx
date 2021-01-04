import { Button, Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { apiGetAssignedUsersForJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Job } from '#views/Jobs/types';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import checkPermission from '#services/uiPermissions';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from '@reach/router';
import { usePrevious } from '#utils/usePrevious';

import { completeJob, getSignOffState } from '../actions';
import { JobState } from '../composer.types';

const JobHeaderButtons: FC = () => {
  const { jobState, data } = useTypedSelector((state) => state.composer);

  const { profile } = useTypedSelector((state) => state.auth);

  const location = useLocation();

  const [isLoggedInUserAssigned, setIsLoggedInUserAssigned] = useState(false);

  const { id: jobId, code, checklist: { name } = {} } = (data as Job) ?? {};

  const prevJobState = usePrevious(jobState);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget);

  const isInboxView = location.pathname.split('/')[1] === 'inbox';

  const showBulkAssignButton =
    jobState !== JobState.COMPLETED &&
    jobState !== JobState.COMPLETED_WITH_EXCEPTION &&
    !isInboxView;

  const isLoggedInUserOperator = profile?.roles?.some(
    (role) => role.name === 'OPERATOR',
  );

  const getAssignments = async () => {
    if (jobId) {
      const { data, errors } = await request(
        'GET',
        apiGetAssignedUsersForJob(jobId),
      );

      if (data) {
        setIsLoggedInUserAssigned(data.some((user) => user.id === profile?.id));
      } else {
        console.error(
          'error came in fetch assigned users from component :: ',
          errors,
        );
      }
    }
  };

  useEffect(() => {
    getAssignments();
  }, [jobId]);

  useEffect(() => {
    if (prevJobState === JobState.UNASSIGNED && jobState === JobState.ASSIGNED)
      getAssignments();
  }, [jobState]);

  let hidePrintJob = false;
  hidePrintJob =
    ((jobState === JobState.COMPLETED ||
      jobState === JobState.COMPLETED_WITH_EXCEPTION) &&
      isLoggedInUserOperator) ||
    false;

  return (
    <div className="buttons-container">
      {jobState === JobState.IN_PROGRESS &&
      (isLoggedInUserAssigned ||
        checkPermission(['inbox', 'completeWithException'])) ? (
        <>
          <Button1
            className="sign-off"
            color="blue"
            variant="secondary"
            onClick={() =>
              dispatch(
                getSignOffState({
                  jobId,
                  allowSignOff: isLoggedInUserAssigned,
                }),
              )
            }
          >
            {isLoggedInUserAssigned ? 'Sign Completed Task' : 'Sign Off State'}
          </Button1>
        </>
      ) : null}

      {jobState === JobState.COMPLETED_WITH_EXCEPTION ? (
        <Button1
          color="blue"
          variant="secondary"
          onClick={() =>
            dispatch(
              openOverlayAction({
                type: OverlayNames.SHOW_COMPLETED_JOB_WITH_EXCEPTION_INFO,
                props: {
                  jobId: data?.id,
                  name: data?.checklist?.name,
                  code: data?.code,
                },
              }),
            )
          }
        >
          View Info
        </Button1>
      ) : null}

      {!hidePrintJob && (
        <Button
          onClick={() => {
            window.open(`/jobs/print/${jobId}`, '_blank');
          }}
        >
          Print Job
        </Button>
      )}

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

      {jobState === JobState.ASSIGNED && isLoggedInUserAssigned ? (
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

      {jobState === JobState.IN_PROGRESS && isLoggedInUserAssigned ? (
        <div className="dropdown-button">
          <Button
            onClick={() =>
              dispatch(completeJob({ jobId, details: { code }, isInboxView }))
            }
          >
            Complete Job
          </Button>

          {checkPermission(['inbox', 'completeWithException']) && (
            <>
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
                        props: { jobId, code, name, isInboxView },
                      }),
                    );
                    handleClose();
                  }}
                >
                  Complet Job with exception
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      ) : null}

      {jobState !== JobState.IN_PROGRESS &&
      jobState !== JobState.COMPLETED &&
      jobState !== JobState.COMPLETED_WITH_EXCEPTION &&
      checkPermission(['inbox', 'completeWithException']) ? (
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