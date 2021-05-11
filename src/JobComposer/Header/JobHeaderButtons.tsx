import { Button, Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store/helpers';
import { apiGetAllUsersAssignedToJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { usePrevious } from '#utils/usePrevious';
import { Job, JobStateEnum } from '#views/Jobs/NewListView/types';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Print } from '@material-ui/icons';
import { navigate, useLocation } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { completeJob, getSignOffState } from '../actions';
import { CompletedJobStates } from '../../views/Jobs/NewListView/types';

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
    jobState !== JobStateEnum.COMPLETED &&
    jobState !== JobStateEnum.COMPLETED_WITH_EXCEPTION &&
    !isInboxView;

  const isLoggedInUserOperator = profile?.roles?.some(
    (role) => role.name === 'OPERATOR',
  );

  const getAssignments = async () => {
    if (jobId) {
      const { data, errors } = await request(
        'GET',
        apiGetAllUsersAssignedToJob(jobId),
      );

      if (data) {
        setIsLoggedInUserAssigned(
          (data as User[]).some((user) => user.id === profile?.id),
        );
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
    if (
      prevJobState === JobStateEnum.UNASSIGNED &&
      jobState === JobStateEnum.ASSIGNED
    )
      getAssignments();
  }, [jobState]);

  let hidePrintJob = false;
  hidePrintJob =
    ((jobState === JobStateEnum.COMPLETED ||
      jobState === JobStateEnum.COMPLETED_WITH_EXCEPTION) &&
      isLoggedInUserOperator) ||
    false;

  return (
    <div className="buttons-container">
      {jobState === JobStateEnum.IN_PROGRESS &&
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

      {!isInboxView && jobState in CompletedJobStates ? (
        <Button1
          className="job-summary"
          color="blue"
          variant="secondary"
          onClick={() => navigate(`/jobs/${jobId}/summary`)}
        >
          Job Summary
        </Button1>
      ) : null}

      {jobState === JobStateEnum.COMPLETED_WITH_EXCEPTION ? (
        <Button1
          className="view-info"
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
        <Button1
          className="print-job"
          onClick={() => {
            window.open(`/jobs/print/${jobId}`, '_blank');
          }}
          variant="secondary"
        >
          <Print className="icon print" />
        </Button1>
      )}

      {showBulkAssignButton ? (
        <Button1
          className="bulk-assign"
          onClick={() => navigate(`/jobs/${jobId}/assignments`)}
        >
          Bulk Assign Tasks
        </Button1>
      ) : null}

      {isInboxView &&
      jobState === JobStateEnum.ASSIGNED &&
      isLoggedInUserAssigned ? (
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

      {jobState === JobStateEnum.IN_PROGRESS && isLoggedInUserAssigned ? (
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
                  Complete Job with exception
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      ) : null}

      {jobState !== JobStateEnum.IN_PROGRESS &&
      jobState !== JobStateEnum.COMPLETED &&
      jobState !== JobStateEnum.COMPLETED_WITH_EXCEPTION &&
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
