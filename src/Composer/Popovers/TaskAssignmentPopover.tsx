import React, { FC } from 'react';
import { Popover, Zoom } from '@material-ui/core';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';

export interface TaskAssignmentPopoverProps {
  closePopover: () => void;
  popOverAnchorEl: Element | ((element: Element) => Element);
  handlePopoverClose: () => void;
  taskId: number;
}

export const TaskAssignmentPopover: FC<TaskAssignmentPopoverProps> = ({
  closePopover,
  popOverAnchorEl,
  taskId,
}) => {
  return (
    <Popover
      id={`taskAssginmentPopOver${taskId}`}
      open={!!popOverAnchorEl}
      anchorEl={popOverAnchorEl}
      onClose={() => console.log('popover hover out')}
      TransitionComponent={Zoom}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <TaskUserAssignment taskId={taskId} closeModal={closePopover} />
    </Popover>
  );
};
