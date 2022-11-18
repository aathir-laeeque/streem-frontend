import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { User } from '#store/users/types';
import { Job, JobStateEnum, JobStateType } from '#views/Jobs/ListView/types';
import { openLinkInNewTab } from '#utils';
import { Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CompletedJobStates } from '#views/Jobs/ListView/types';
import { completeJob } from '../actions';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const JobHeaderButtons: FC<{
  jobState: JobStateType;
  isLoggedInUserAssigned: boolean;
  isInboxView: boolean;
  profile: User | null;
  jobData?: Job;
  fullView: boolean;
  setFullView: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  jobData,
  jobState,
  isInboxView,
  profile,
  isLoggedInUserAssigned,
  setFullView,
  fullView,
}) => {
  const { id: jobId, code, checklist } = (jobData as Job) ?? {};

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(event.currentTarget);

  const showBulkAssignButton =
    jobState !== JobStateEnum.COMPLETED &&
    jobState !== JobStateEnum.COMPLETED_WITH_EXCEPTION &&
    !isInboxView &&
    checkPermission(['checklists', 'createJob']);

  if (!jobId) return null;

  return (
    <div className="buttons-container">
      {jobState in CompletedJobStates && (
        <Button
          className="job-summary"
          color="blue"
          variant="secondary"
          onClick={() => navigate(`/jobs/${jobId}/summary`)}
        >
          Job Summary
        </Button>
      )}

      {jobState === JobStateEnum.COMPLETED_WITH_EXCEPTION && (
        <Button
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
        </Button>
      )}

      {showBulkAssignButton && (
        <Button className="bulk-assign" onClick={() => navigate(`/jobs/${jobId}/assignments`)}>
          Bulk Assign Tasks
        </Button>
      )}

      {isInboxView && jobState === JobStateEnum.ASSIGNED && isLoggedInUserAssigned && (
        <Button
          className="bulk-assign"
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
          className="bulk-assign"
          onClick={() => dispatch(completeJob({ jobId, details: { code }, isInboxView }))}
        >
          Complete Job
        </Button>
      )}

      <Button className="more" variant="secondary" onClick={handleClick}>
        <MoreVert className="icon" fontSize="small" />
      </Button>
      <Button className="more" variant="secondary" onClick={() => setFullView((prev) => !prev)}>
        {fullView ? (
          <FullscreenExitIcon className="icon" fontSize="small" />
        ) : (
          <FullscreenIcon className="icon" fontSize="small" />
        )}
      </Button>

      <Menu
        id="job-more-options-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableEnforceFocus
        style={{ marginTop: 40 }}
      >
        <MenuItem
          onClick={() => {
            openLinkInNewTab(`/jobs/${jobId}/print`);
            handleClose();
          }}
        >
          Download Job
        </MenuItem>
        <MenuItem
          className="job-activities"
          onClick={() => {
            navigate(`/jobs/${jobId}/activities`);
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
              <span style={{ color: '#da1e28' }}>Complete Job with Exception</span>
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
              <span style={{ color: '#da1e28' }}>Complete Job with Exception</span>
            </MenuItem>
          )}
      </Menu>
    </div>
  );
};

export default JobHeaderButtons;
