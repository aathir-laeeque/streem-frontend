import { BaseModal, Checkbox } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Checklist } from '#Composer-new/checklist.types';
import { Reviewer, ReviewerState } from '#Composer-new/reviewer.types';
import { useTypedSelector } from '#store';
import { fetchUsers } from '#store/users/actions';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Search } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  assignReviewersToChecklist,
  assignReviewerToChecklist,
  revertReviewersForChecklist,
  unAssignReviewerFromChecklist,
  fetchAssignedReviewersForChecklist,
} from '../reviewer.actions';

import Wrapper from './ReviewerAssignment.styles';

type initialState = {
  assignedUsers: number[];
  unAssignedUsers: number[];
  searchQuery: string;
  preAssignedUsers: Reviewer[];
};

const initialState: initialState = {
  assignedUsers: [],
  unAssignedUsers: [],
  searchQuery: '',
  preAssignedUsers: [],
};

const ReviewerAssignmentModal: FC<CommonOverlayProps<{
  checklistId: Checklist['id'];
  isModal: boolean;
}>> = ({
  closeAllOverlays = () => false,
  closeOverlay,
  props: { checklistId, isModal = true },
}) => {
  const {
    data: { authors },
    assignees,
    activeUsers: {
      list,
      pageable: { last, page },
    },
  } = useTypedSelector((state) => ({
    activeUsers: state.users.active,
    assignees: state.prototypeComposer.reviewers,
    data: state.prototypeComposer.data as Checklist,
  }));

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);
  const {
    assignedUsers,
    unAssignedUsers,
    searchQuery,
    preAssignedUsers,
  } = state;
  const prevSearch = usePrevious(searchQuery);
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

  if (checklistId) {
    useEffect(() => {
      dispatch(fetchAssignedReviewersForChecklist(checklistId));
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
    user: Reviewer,
    checked: boolean,
    isPreAssigned: boolean,
  ) => {
    console.log('checked', checked);
    if (checked) {
      if (isPreAssigned) {
        setstate({
          ...state,
          unAssignedUsers: [...unAssignedUsers, user.id],
          assignedUsers: assignedUsers.filter((i) => i !== user.id),
        });
        dispatch(unAssignReviewerFromChecklist(user));
      } else {
        setstate({
          ...state,
          unAssignedUsers: [...unAssignedUsers, user.id],
          assignedUsers: assignedUsers.filter((i) => i !== user.id),
        });
        dispatch(unAssignReviewerFromChecklist(user));
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
      dispatch(assignReviewerToChecklist(user));
    }
  };

  const userRow = (
    user: Reviewer,
    checked: boolean,
    isPreAssigned: boolean,
  ) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          {checklistId && (
            <Checkbox
              checked={checked}
              label=""
              onClick={() => onCheckChanged(user, checked, isPreAssigned)}
              disabled={
                user.state ? user.state !== ReviewerState.NOT_STARTED : false
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
    if (checklistId) dispatch(revertReviewersForChecklist([]));
  };

  const bodyView: JSX.Element[] = [];

  if (list) {
    if (searchQuery === '') {
      preAssignedUsers.forEach((user) => {
        if (user.id !== 0) {
          const checked = assignees.some((item) => item.id === user.id);
          const isAuthor = authors.some((item) => item.id === user.id);
          if (!isAuthor) bodyView.push(userRow(user, checked, true));
        }
      });
    }

    ((list as unknown) as Array<Reviewer>).forEach((user) => {
      const isPreAssigned = preAssignedUsers.some(
        (item) => item.id === user.id,
      );
      const checked = assignees.some((item) => item.id === user.id);
      const isAuthor = authors.some((item) => item.id === user.id);

      if (user.id !== 0 && !isAuthor) {
        if (searchQuery !== '') {
          bodyView.push(userRow(user, checked, isPreAssigned));
        } else if (!isPreAssigned) {
          bodyView.push(userRow(user, checked, isPreAssigned));
        }
      }
    });
  }

  const onPrimary = () => {
    if (checklistId)
      dispatch(
        assignReviewersToChecklist({
          checklistId: checklistId,
          assignIds: assignedUsers,
          unassignIds: unAssignedUsers,
        }),
      );
    closeOverlay();
  };

  const onSecondary = () => {
    closeOverlay();
  };

  return (
    <Wrapper isModal={isModal}>
      <BaseModal
        animated={isModal}
        closeAllModals={closeAllOverlays}
        closeModal={onSecondary}
        title="Add Reviewers"
        primaryText="Confirm"
        secondaryText="Cancel"
        onSecondary={onSecondary}
        onPrimary={onPrimary}
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

export default ReviewerAssignmentModal;
