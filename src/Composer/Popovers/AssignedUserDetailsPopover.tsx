import React, { FC } from 'react';
import { Users } from '#store/users/types';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    marginTop: '5px',
    overflow: 'visible',
    padding: '8px',

    '&::before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      position: 'absolute',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: '5px solid #FFF',
      left: 'calc(50% - 5px)',
      top: '-5px',
    },
  },
  title: {
    fontSize: '20px',
    color: '#00000',
    marginTop: '8px',
    textTransform: 'capitalize',
  },
  id: {
    fontWeight: 600,
    fontSize: '8px',
    color: '#00000',
    textTransform: 'capitalize',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
  },
});

export interface AssignedUserDetailsPopoverProps {
  closePopover: () => void;
  popOverAnchorEl: Element | ((element: Element) => Element);
  handlePopoverClose: () => void;
  users: Users;
}

export const AssignedUserDetailsPopover: FC<AssignedUserDetailsPopoverProps> = ({
  closePopover,
  popOverAnchorEl,
  users,
}) => {
  const classes = useStyles();

  return (
    <Popover
      id={`assignedUserDetailsPopOver`}
      open={!!popOverAnchorEl}
      anchorEl={popOverAnchorEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={{
        paper: classes.paper,
      }}
    >
      {users.map((user) => (
        <div
          className={classes.wrapper}
          key={`assignedUserDetailsPopOver_${user.id}`}
        >
          <span className={classes.id}>{user.employeeId}</span>
          <span
            className={classes.title}
          >{`${user.firstName} ${user.lastName}`}</span>
        </div>
      ))}
    </Popover>
  );
};
