import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { StyledMenu } from '#components/shared/StyledMenu';
import checkPermission from '#services/uiPermissions';
import { User } from '#store/users/types';
import { openLinkInNewTab } from '#utils';
import { CompletedJobStates, Job, JobStateEnum, JobStateType } from '#views/Jobs/ListView/types';
import { MenuItem } from '@material-ui/core';
import { ChevronLeft, ChevronRight, MoreVert } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

const JobHeaderButtons: FC<{
  jobState: JobStateType;
  isLoggedInUserAssigned: boolean;
  isInboxView: boolean;
  profile: User | null;
  jobData?: Job;
  overviewOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}> = ({ jobData, jobState, isInboxView, isLoggedInUserAssigned, overviewOpen }) => {
  const { id: jobId, code, checklist } = (jobData as Job) ?? {};

  const dispatch = useDispatch();
  const [isOverviewOpen, setOverviewOpen] = overviewOpen;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) =>
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

      <div className="more open-overview" onClick={() => setOverviewOpen((prev) => !prev)}>
        {isOverviewOpen ? <ChevronRight /> : <ChevronLeft />}
      </div>

      <div className="more" onClick={handleClick}>
        <MoreVert />
      </div>

      <StyledMenu
        id="job-more-options-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
        <MenuItem
          className="view-verifications"
          onClick={() => {
            dispatch(
              openOverlayAction({
                type: OverlayNames.JOB_VERIFICATION,
                props: {
                  jobId,
                },
              }),
            );
          }}
        >
          View Verifications
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
      </StyledMenu>
    </div>
  );
};

export default JobHeaderButtons;
