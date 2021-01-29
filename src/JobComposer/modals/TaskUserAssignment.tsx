import { BaseModal, Checkbox } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Task } from '#JobComposer/checklist.types';
import { defaultParams, OtherUserState, User, useUsers } from '#services/users';
import { useTypedSelector } from '#store';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Job } from '#views/Jobs/types';
import { Search } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { assignUsersToJob, fetchAssignedUsersForJob } from '../actions';
import { assignUsersToTask } from '../TaskList/actions';
import Wrapper from './TaskUserAssignment.styles';

type initialState = {
  assignedUsers: User[];
  searchQuery: string;
  preAssignedUsers: User[];
};

const initialState: initialState = {
  assignedUsers: [],
  searchQuery: '',
  preAssignedUsers: [],
};

const TaskUserAssignment: FC<CommonOverlayProps<{
  taskId?: Task['id'];
  jobId?: Job['id'];
  forAll?: boolean;
}>> = ({
  closeAllOverlays = () => false,
  closeOverlay,
  props: { taskId, jobId, forAll = false },
}) => {
  const {
    tasks: { tasksById },
    entityId,
  } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);
  const { assignedUsers, searchQuery, preAssignedUsers } = state;
  const prevSearch = usePrevious(searchQuery);

  const { users: list, loadMore, loadAgain } = useUsers({
    userState: OtherUserState.TASKS,
    params: { ...defaultParams },
  });

  let assignees: User[] = [];
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

  useEffect(() => {
    if (jobId) {
      dispatch(fetchAssignedUsersForJob(jobId));
    }
  }, []);

  useEffect(() => {
    if (
      (prevAssignees === undefined || prevAssignees.length === 0) &&
      assignees.length > 0 &&
      assignedUsers.length === 0
    ) {
      setstate({
        ...state,
        preAssignedUsers: assignees,
        assignedUsers: assignees,
      });
    }
  }, [assignees]);

  useEffect(() => {
    if (prevSearch !== searchQuery) {
      loadAgain({
        newParams: {
          ...defaultParams,
          filters: JSON.stringify({
            op: 'AND',
            fields: [{ field: 'firstName', op: 'LIKE', values: [searchQuery] }],
          }),
        },
      });
    }
  }, [searchQuery]);

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7)
      loadMore();
  };

  const onCheckChanged = (user: User, checked: boolean, partial: boolean) => {
    if (checked) {
      if (jobId) {
        if (!partial) {
          setstate({
            ...state,
            assignedUsers: assignedUsers.filter((i) => i.id !== user.id),
          });
        } else {
          setstate({
            ...state,
            assignedUsers: [
              ...assignedUsers.filter((i) => i.id !== user.id),
              { ...user, completelyAssigned: true },
            ],
          });
        }
      } else {
        setstate({
          ...state,
          assignedUsers: assignedUsers.filter((i) => i.id !== user.id),
        });
      }
    } else {
      if (jobId) {
        setstate({
          ...state,
          assignedUsers: [
            ...assignedUsers,
            { ...user, completelyAssigned: true },
          ],
        });
      } else {
        setstate({
          ...state,
          assignedUsers: [
            ...assignedUsers,
            { ...user, completelyAssigned: true },
          ],
        });
      }
    }
  };

  const userRow = (user: User, checked: boolean, partial: boolean) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          {taskId && (
            <Checkbox
              checked={checked}
              label=""
              onClick={() => onCheckChanged(user, checked, partial)}
            />
          )}
          {jobId && (
            <Checkbox
              partial={partial}
              checked={checked}
              label=""
              onClick={() => onCheckChanged(user, checked, partial)}
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
      assignedUsers: [],
    });
  };

  const bodyView: JSX.Element[] = [];

  if (list) {
    if (searchQuery === '') {
      preAssignedUsers.forEach((user) => {
        let checked = false;
        let isPartial = false;

        assignedUsers.every((item) => {
          if (user.id === item.id) {
            checked = true;
            if (jobId) isPartial = !item.completelyAssigned;
            return false;
          }
          return true;
        });

        bodyView.push(userRow(user, checked, isPartial));
      });
    }

    list.forEach((user) => {
      const isPreAssigned = preAssignedUsers.some(
        (item) => item.id === user.id,
      );

      if (searchQuery !== '' || !isPreAssigned) {
        const checked = assignedUsers.some((i) => i.id === user.id);

        bodyView.push(
          userRow(
            user,
            checked,
            (!user.completelyAssigned && user.assigned) || false,
          ),
        );
      }
    });
  }

  const onPrimary = (notify: boolean) => {
    if (entityId) {
      const unassignIds = preAssignedUsers.reduce<string[]>((acc, item) => {
        if (!assignedUsers.some((i) => i.id === item.id)) {
          acc.push(item.id);
        }
        return acc;
      }, []);

      if (taskId) {
        const assignIds = assignedUsers.reduce<string[]>((acc, item) => {
          if (!preAssignedUsers.some((i) => i.id === item.id)) {
            acc.push(item.id);
          }
          return acc;
        }, []);
        dispatch(
          assignUsersToTask({
            taskId,
            jobId: entityId,
            assignIds,
            unassignIds,
            assignedUsers,
            notify,
          }),
        );
      }
      if (jobId) {
        const assignIds = assignedUsers.reduce<string[]>((acc, item) => {
          const inPreAssigned = preAssignedUsers.filter(
            (i) => i.id === item.id,
          );
          if (inPreAssigned.length === 0) {
            acc.push(item.id);
          } else if (inPreAssigned.length > 0) {
            if (
              inPreAssigned[0]?.completelyAssigned !== item?.completelyAssigned
            )
              acc.push(item.id);
          }
          return acc;
        }, []);
        dispatch(
          assignUsersToJob({
            jobId: jobId,
            assignIds,
            unassignIds,
            assignedUsers,
            notify,
          }),
        );
      }
    }

    closeOverlay();
  };

  const onSecondary = () => {
    closeOverlay();
  };

  return (
    <Wrapper forAll={forAll}>
      <BaseModal
        animated={forAll}
        closeAllModals={closeAllOverlays}
        closeModal={onSecondary}
        title={forAll ? 'Bulk Assign All Tasks' : 'Assign this Task'}
        primaryText="Confirm"
        secondaryText="Cancel"
        onSecondary={onSecondary}
        onPrimary={() => onPrimary(true)}
        disabledPrimary={assignedUsers === preAssignedUsers}
        modalFooterOptions={
          assignedUsers.length === 0 ? null : (
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
          )
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
              placeholder="Search with First Name"
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
