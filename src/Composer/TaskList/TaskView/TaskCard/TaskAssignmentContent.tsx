import React, { MouseEvent } from 'react';

import { People } from '@material-ui/icons';

import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useDispatch } from 'react-redux';

export default function TaskAssignmentContent({ taskId }: { taskId: number }) {
  const dispatch = useDispatch();

  const handlePopoverOpen = (event: MouseEvent) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.TASK_USER_ASSIGNMENT,
        popOverAnchorEl: event.currentTarget,
        props: {
          taskId,
        },
      }),
    );
  };

  return (
    <>
      <People
        className="icon"
        style={{
          color: '#1d84ff',
          border: '1px solid #1d84ff',
          borderRadius: '4px',
          padding: '2px',
        }}
        onClick={(e: MouseEvent) => handlePopoverOpen(e)}
      />
    </>
  );
}
