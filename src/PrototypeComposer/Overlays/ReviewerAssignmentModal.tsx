import { BaseModal, Checkbox } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Checklist } from '#PrototypeComposer/checklist.types';
import {
  Collaborator,
  CollaboratorState,
} from '#PrototypeComposer/reviewer.types';
import { useUsers, OtherUserState, defaultParams } from '#services/users';
import { useTypedSelector } from '#store';
// import { fetchUsers } from '#store/users/actions';
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
  assignedUsers: Collaborator['id'][];
  unAssignedUsers: Collaborator['id'][];
  searchQuery: string;
  preAssignedUsers: Collaborator[];
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
    data: { authors, reviewCycle },
    assignees,
    // activeUsers: {
    //   list,
    //   pageable: { last, page },
    // },
  } = useTypedSelector((state) => ({
    // activeUsers: state.users.active,
    assignees: state.prototypeComposer.collaborators,
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

  const { users: list, loadMore, loadAgain } = useUsers({
    userState: OtherUserState.REVIEWERS,
    params: { ...defaultParams },
  });

  // const fetchData = (page: number, size: number) => {
  //   const filters = JSON.stringify({
  //     op: 'AND',
  //     fields: [
  //       { field: 'firstName', op: 'LIKE', values: [searchQuery] },
  //       { field: 'archived', op: 'EQ', values: [false] },
  //       // { field: 'lastName', op: 'LIKE', values: [searchQuery] },
  //       // { field: 'employeeId', op: 'LIKE', values: [searchQuery] },
  //     ],
  //   });
  //   dispatch(fetchUsers({ page, size, filters, sort: 'id' }, 'active'));
  // };

  if (checklistId) {
    useEffect(() => {
      dispatch(revertReviewersForChecklist([]));
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

  const onCheckChanged = (
    user: Collaborator,
    checked: boolean,
    isPreAssigned: boolean,
  ) => {
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
    user: Collaborator,
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
                user.state
                  ? user.state === CollaboratorState.NOT_STARTED
                    ? false
                    : true
                  : false
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
    const filteredAssignees = preAssignedUsers.filter(
      (user) =>
        user.reviewCycle === reviewCycle &&
        user.state !== CollaboratorState.NOT_STARTED,
    );
    setstate({
      ...state,
      unAssignedUsers: filteredAssignees.map((i) => i.id),
      assignedUsers: [],
    });
    if (checklistId) dispatch(revertReviewersForChecklist([]));
  };

  const bodyView: JSX.Element[] = [];

  if (list) {
    if (searchQuery === '') {
      preAssignedUsers.forEach((user) => {
        if (user.id !== '0') {
          const checked = assignees.some((item) => item.id === user.id);
          const isAuthor = authors.some((item) => item.id === user.id);
          if (!isAuthor) bodyView.push(userRow(user, checked, true));
        }
      });
    }

    ((list as unknown) as Array<Collaborator>).forEach((user) => {
      const isPreAssigned = preAssignedUsers.some(
        (item) => item.id === user.id,
      );
      const checked = assignees.some((item) => item.id === user.id);
      const isAuthor = authors.some((item) => item.id === user.id);

      if (user.id !== '0' && !isAuthor) {
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
        disabledPrimary={
          state.assignedUsers.length === 0 && state.unAssignedUsers.length === 0
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

export default ReviewerAssignmentModal;
