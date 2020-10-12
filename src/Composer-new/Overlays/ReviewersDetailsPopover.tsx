import React, { FC } from 'react';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Reviewer, ReviewerState } from '#Composer-new/reviewer.types';
import { removeUnderscore } from '#utils/stringUtils';

const useStyles = makeStyles({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    marginTop: '5px',
    overflow: 'visible',
    padding: '24px',

    '&::before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      position: 'absolute',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: '5px solid #FFF',
      left: 'calc(100% - 5px)',
      top: '-5px',
    },
  },
  headingWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '14px',
    color: '#00000',
    textTransform: 'capitalize',
  },
  status: {
    fontSize: '14px',
    marginLeft: '24px',
    textTransform: 'capitalize',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  heading: {
    fontSize: '14px',
    color: '#00000',
    fontWeight: 600,
  },
});

export const ReviewersDetailsPopover: FC<CommonOverlayProps<{
  users: Reviewer[];
}>> = ({ closeOverlay, popOverAnchorEl, props: { users } }) => {
  const classes = useStyles();

  return (
    <Popover
      id={`reviewersDetailsPopOver`}
      open={!!popOverAnchorEl}
      anchorEl={popOverAnchorEl}
      onClose={closeOverlay}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
    >
      <div className={classes.headingWrapper}>
        <span className={classes.heading}>Reviewers</span>
        <span className={classes.heading}>Status</span>
      </div>
      {users.map((user: Reviewer, index: number) => (
        <div
          className={classes.wrapper}
          key={`reviewersDetailsPopOver_${user.id}`}
        >
          <span className={classes.title}>{`${index + 1}. ${user.firstName} ${
            user.lastName
          } ID: ${user.employeeId}`}</span>
          <span
            className={classes.status}
            style={{
              color:
                user.state === ReviewerState.IN_PROGRESS
                  ? '#1d84ff'
                  : '#5aa700',
            }}
          >
            {removeUnderscore(user.state.toLowerCase())}
          </span>
        </div>
      ))}
    </Popover>
  );
};
