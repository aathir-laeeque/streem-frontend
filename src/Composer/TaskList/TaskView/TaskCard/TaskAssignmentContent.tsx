import React, { MouseEvent } from 'react';

import { People } from '@material-ui/icons';

import { openPopoverAction } from '#components/PopoverContainer/actions';
import { PopoverNames } from '#components/PopoverContainer/types';
import { useDispatch } from 'react-redux';

export default function TaskAssignmentContent({ taskId }: { taskId: number }) {
  const dispatch = useDispatch();

  const handlePopoverOpen = (event: MouseEvent) => {
    dispatch(
      openPopoverAction({
        type: PopoverNames.TASK_USER_ASSIGNMENT,
        popOverAnchorEl: event.currentTarget,
        props: {
          taskId: taskId,
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
