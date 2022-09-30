import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { Task } from '#JobComposer/checklist.types';
import { Job } from '#views/Jobs/ListView/types';
import { People } from '@material-ui/icons';
import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  jobId: Job['id'];
  taskId: Task['id'];
  taskExecutionId: Task['taskExecution']['id'];
};

export default function TaskAssignmentContent({ taskId, jobId, taskExecutionId }: Props) {
  const dispatch = useDispatch();

  const handlePopoverOpen = (event: MouseEvent) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.USER_ASSIGNMENT,
        popOverAnchorEl: event.currentTarget,
        props: {
          jobId,
          selectedTasks: [[taskExecutionId, taskId]],
        },
      }),
    );
  };

  return (
    <People
      className="icon"
      style={{
        color: '#1d84ff',
        border: '1px solid #1d84ff',
        padding: '2px',
      }}
      onClick={(e: MouseEvent) => handlePopoverOpen(e)}
    />
  );
}
