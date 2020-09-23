import React, { FC } from 'react';
import { Popover, Zoom } from '@material-ui/core';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';

export const TaskAssignmentPopover: FC<CommonOverlayProps<{
  taskId: number;
}>> = ({
  closeOverlay,
  closeAllOverlays,
  popOverAnchorEl,
  type,
  props: { taskId },
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
      <TaskUserAssignment
        props={{ taskId }}
        closeAllOverlays={closeAllOverlays}
        closeOverlay={closeOverlay}
        type={type}
        key="TaskUserAssginementPopOver"
      />
    </Popover>
  );
};
