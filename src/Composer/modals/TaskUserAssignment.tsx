import { BaseModal, Checkbox } from '#components';
import { Task } from '#Composer/checklist.types';
import { useTypedSelector } from '#store';
import { fetchUsers } from '#store/users/actions';
import { User, Users } from '#store/users/types';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Job } from '#views/Jobs/types';
import { Search } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  assignUsersToTask,
  assignUserToTask,
  revertUsersForTask,
  unAssignUserFromTask,
} from '../TaskList/actions';
import {
  fetchAssignedUsersForJob,
  assignUsersToJob,
  assignUserToJob,
  unAssignUserFromJob,
  revertUsersForJob,
} from '../actions';
import Wrapper from './TaskUserAssignment.styles';

type TaskUserAssignmentProps = {
  closeAllModals?: () => void;
  closeModal: () => void;
  taskId?: Task['id'];
  jobId?: Job['id'];
  forAll?: boolean;
};

type initialState = {
  assignedUsers: number[];
  unAssignedUsers: number[];
  searchQuery: string;
  preAssignedUsers: Users;
};

const initialState: initialState = {
  assignedUsers: [],
  unAssignedUsers: [],
  searchQuery: '',
  preAssignedUsers: [],
};

const TaskUserAssignment: FC<TaskUserAssignmentProps> = ({
  closeAllModals = () => false,
  closeModal,
  taskId,
  jobId,
  forAll = false,
}) => {
  const {
    list,
    pageable: { last, page },
  } = useTypedSelector((state) => state.users.users.active);
  const {
    tasks: { tasksById },
    entityId,
  } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);
  const {
    assignedUsers,
    unAssignedUsers,
    searchQuery,
    preAssignedUsers,
  } = state;
  const prevSearch = usePrevious(searchQuery);

  let assignees: Users = [];
  if (taskId) {
    const {
      taskExecution: { assignees: taskAssignees },
    } = tasksById[taskId];
    assignees = taskAssignees;
  } else {
    const { assignees: jobAssignees } = useTypedSelector(
      (state) => state.composer,
    );
    assignees = jobAssignees;
  }

  const prevAssignees = usePrevious(assignees);

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'OR',
      fields: [
        { field: 'firstName', op: 'LIKE', values: [searchQuery] },
        { field: 'lastName', op: 'LIKE', values: [searchQuery] },
      ],
    });
    dispatch(fetchUsers({ page, size, filters, sort: 'id' }, 'active'));
  };

  if (jobId) {
    useEffect(() => {
      dispatch(fetchAssignedUsersForJob(jobId));
    }, []);
  }

  useEffect(() => {
    if (
      (prevAssignees === undefined || prevAssignees.length === 0) &&
      assignees.length > 0 &&
      assignedUsers.length === 0 &&
      unAssignedUsers.length === 0
    ) {
      setstate({ ...state, preAssignedUsers: assignees });
    }
  }, [assignees]);

  useEffect(() => {
    if (prevSearch !== searchQuery) {
      fetchData(0, 10);
    }
  }, [searchQuery]);

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7 && !last)
      fetchData(page + 1, 10);
  };

  const onCheckChanged = (
    user: User,
    checked: boolean,
    isPreAssigned: boolean,
    partial: boolean,
  ) => {
    if (checked) {
      if (jobId && isPreAssigned) {
        if (!partial) {
          setstate({
            ...state,
            unAssignedUsers: [...unAssignedUsers, user.id],
            assignedUsers: assignedUsers.filter((i) => i !== user.id),
          });
          dispatch(unAssignUserFromJob(user));
        } else {
          setstate({
            ...state,
            assignedUsers: [...assignedUsers, user.id],
          });
          dispatch(assignUserToJob(user));
        }
      } else {
        setstate({
          ...state,
          unAssignedUsers: [...unAssignedUsers, user.id],
          assignedUsers: assignedUsers.filter((i) => i !== user.id),
        });
        if (taskId) dispatch(unAssignUserFromTask(user, taskId));
        if (jobId) dispatch(unAssignUserFromJob(user));
      }
    } else {
      if (isPreAssigned) {
        setstate({
          ...state,
          unAssignedUsers: unAssignedUsers.filter((i) => i !== user.id),
        });
      } else {
        setstate({
          ...state,
          assignedUsers: [...assignedUsers, user.id],
          unAssignedUsers: unAssignedUsers.filter((i) => i !== user.id),
        });
      }
      if (taskId) dispatch(assignUserToTask(user, taskId));
      if (jobId) dispatch(assignUserToJob(user));
    }
  };

  const userRow = (
    user: User,
    checked: boolean,
    isPreAssigned: boolean,
    partial: boolean,
  ) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          {taskId && (
            <Checkbox
              checked={checked}
              label=""
              onClick={() =>
                onCheckChanged(user, checked, isPreAssigned, partial)
              }
            />
          )}
          {jobId && (
            <Checkbox
              partial={partial}
              checked={checked}
              label=""
              onClick={() =>
                onCheckChanged(user, checked, isPreAssigned, partial)
              }
            />
          )}
        </div>
        <div className="thumb">
          {getInitials(`${user.firstName} ${user.lastName}`)}
        </div>
        <div className="middle">
          <span className="userId">{user.employeeId}</span>
          <span className="userName">{`${user.firstName} ${user.lastName}`}</span>
        </div>
      </div>
    );
  };

  const handleUnselectAll = () => {
    setstate({
      ...state,
      unAssignedUsers: preAssignedUsers.map((i) => i.id),
      assignedUsers: [],
    });
    if (taskId) dispatch(revertUsersForTask([], taskId));
    if (jobId) dispatch(revertUsersForJob([]));
  };

  const bodyView: JSX.Element[] = [];

  if (list) {
    if (searchQuery === '') {
      preAssignedUsers.forEach((user) => {
        const checked = assignees.some((item) => item.id === user.id);
        let isPartial = false;
        if (jobId)
          isPartial = assignees.some(
            (item) =>
              item.id === user.id && !item.completelyAssigned && item.assigned,
          );

        if (user.id !== 0) {
          bodyView.push(userRow(user, checked, true, isPartial));
        }
      });
    }

    list.forEach((user) => {
      const isPreAssigned = preAssignedUsers.some(
        (item) => item.id === user.id,
      );
      const checked = assignees.some((item) => item.id === user.id);

      if (user.id !== 0) {
        if (searchQuery !== '') {
          bodyView.push(
            userRow(
              user,
              checked,
              isPreAssigned,
              (!user.completelyAssigned && user.assigned) || false,
            ),
          );
        } else if (!isPreAssigned) {
          bodyView.push(userRow(user, checked, isPreAssigned, false));
        }
      }
    });
  }

  const onPrimary = (notify: boolean) => {
    if (entityId) {
      if (taskId)
        dispatch(
          assignUsersToTask({
            taskId,
            jobId: entityId,
            assignIds: assignedUsers,
            unassignIds: unAssignedUsers,
            preAssigned: preAssignedUsers,
            notify,
          }),
        );
      if (jobId)
        dispatch(
          assignUsersToJob({
            jobId: jobId,
            assignIds: assignedUsers,
            unassignIds: unAssignedUsers,
            notify,
          }),
        );
    }
    closeModal();
  };

  const onSecondary = () => {
    if (taskId) dispatch(revertUsersForTask(preAssignedUsers, taskId));
    closeModal();
  };

  return (
    <Wrapper forAll={forAll}>
      <BaseModal
        animated={forAll}
        closeAllModals={closeAllModals}
        closeModal={onSecondary}
        title={forAll ? 'Bulk Assign All Tasks' : 'Assign this Task'}
        primaryText="Confirm"
        secondaryText="Cancel"
        onSecondary={onSecondary}
        onPrimary={() => onPrimary(true)}
        modalFooterOptions={
          <span
            style={{
              color: `#1d84ff`,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
            onClick={() => onPrimary(false)}
          >
            Confirm Without Notifying
          </span>
        }
      >
        <div className="top-content">
          <div className="searchboxwrapper">
            <Search className="searchsubmit" />
            <input
              className="searchbox"
              type="text"
              onChange={(e) =>
                setstate({ ...state, searchQuery: e.target.value })
              }
              placeholder="Search Users"
            />
          </div>
          <span onClick={handleUnselectAll}>Unselect All</span>
        </div>
        <div className="scrollable-content" onScroll={handleOnScroll}>
          {bodyView}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskUserAssignment;
