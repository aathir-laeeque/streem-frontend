import { Button, Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { User } from '#store/users/types';
import { Job, JobStateEnum, JobStateType } from '#views/Jobs/NewListView/types';
import { Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CompletedJobStates } from '../../views/Jobs/NewListView/types';
import { completeJob, getSignOffState } from '../actions';

const JobHeaderButtons: FC<{
  jobState: JobStateType;
  isLoggedInUserAssigned: boolean;
  isInboxView: boolean;
  profile: User | null;
  jobData?: Job;
}> = ({ jobData, jobState, isInboxView, profile, isLoggedInUserAssigned }) => {
  const { id: jobId, code, checklist } = (jobData as Job) ?? {};

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => setAnchorEl(event.currentTarget);

  const showBulkAssignButton =
    jobState !== JobStateEnum.COMPLETED &&
    jobState !== JobStateEnum.COMPLETED_WITH_EXCEPTION &&
    !isInboxView;

  const isLoggedInUserOperator = profile?.roles?.some(
    (role) => role.name === 'OPERATOR',
  );

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

      {!isInboxView && jobState in CompletedJobStates && (
        <Button1
          className="job-summary"
          color="blue"
          variant="secondary"
          onClick={() => navigate(`/jobs/${jobId}/summary`)}
        >
          Job Summary
        </Button1>
      )}

      {jobState === JobStateEnum.COMPLETED_WITH_EXCEPTION && (
        <Button1
          className="view-info"
          color="blue"
          variant="secondary"
          onClick={() =>
            dispatch(
              openOverlayAction({
                type: OverlayNames.SHOW_COMPLETED_JOB_WITH_EXCEPTION_INFO,
                props: {
                  jobId: jobData?.id,
                  name: checklist?.name,
                  code: jobData?.code,
                },
              }),
            )
          }
        >
          View Info
        </Button1>
      )}

      {showBulkAssignButton && (
        <Button1
          className="bulk-assign"
          onClick={() => navigate(`/jobs/${jobId}/assignments`)}
        >
          Bulk Assign Tasks
        </Button1>
      )}

      {isInboxView &&
        jobState === JobStateEnum.ASSIGNED &&
        isLoggedInUserAssigned && (
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
        )}

      {jobState === JobStateEnum.IN_PROGRESS && isLoggedInUserAssigned && (
        <Button
          onClick={() =>
            dispatch(completeJob({ jobId, details: { code }, isInboxView }))
          }
        >
          Complete Job
        </Button>
      )}

      <div>
        <Button1
          id="more"
          variant="secondary"
          onClick={handleClick}
          style={{ border: 'none' }}
        >
          <MoreVert className="icon" fontSize="small" />
        </Button1>

        <Menu
          id="job-more-options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ marginTop: 40 }}
        >
          {!hidePrintJob && (
            <MenuItem
              onClick={() => {
                window.open(`/jobs/${jobId}/print`, '_blank');
                handleClose();
              }}
            >
              Download Job
            </MenuItem>
          )}
          <MenuItem
            className="job-activities"
            onClick={() => {
              navigate(`/jobs/${jobId}/activites`);
              handleClose();
            }}
          >
            View Activities
          </MenuItem>
          {jobState === JobStateEnum.IN_PROGRESS &&
            isLoggedInUserAssigned &&
            checkPermission(['inbox', 'completeWithException']) && (
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
                <span style={{ color: '#da1e28' }}>
                  Complete Job with Exception
                </span>
              </MenuItem>
            )}
          {jobState !== JobStateEnum.IN_PROGRESS &&
            jobState !== JobStateEnum.COMPLETED &&
            jobState !== JobStateEnum.COMPLETED_WITH_EXCEPTION &&
            checkPermission(['inbox', 'completeWithException']) && (
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
                <span style={{ color: '#da1e28' }}>
                  Complete Job with Exception
                </span>
              </MenuItem>
            )}
        </Menu>
      </div>
    </div>
  );
};

export default JobHeaderButtons;
