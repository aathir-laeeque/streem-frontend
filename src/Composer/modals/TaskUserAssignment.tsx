import { BaseModal, Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { Task } from '#Composer/checklist.types';
import { fetchUsers } from '#store/users/actions';
import { User, Users } from '#store/users/types';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Search } from '@material-ui/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({})`
  .modal {
    h2 {
      color: #000 !important;
      font-weight: bold !important;
    }

    > svg {
      top: 32px !important;
      right: 32px !important
      font-size: 24px !important;;
    }

    .modal-header {
      padding: 32px !important;
      border-bottom: none !important;
    }

    .modal-footer {
      padding: 32px !important;
    }

    .modal-body {
      padding: 0px 32px !important;

      .top-content {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: space-between;
        padding: 0px 0px 16px;
    
        span {
          padding: 4px 16px;
          color: #1d84ff;
          font-size: 14px;
          cursor; pointer;
        }
    
        .searchboxwrapper {
          position: relative;
          flex: 1;
          padding: 0px 16px;
          background-color: #fafafa;
          border-bottom: 1px solid #bababa;
      
          svg {
            background: #fafafa;
            border: 0;
            height: 40px;
            width: 16px;
            right: unset;
            color: #000;
            position: absolute;
            left: 16px;
            top: 0;
          }
      
          .searchbox {
            border: none;
            outline: none;
            font-size: 13px;
            font-family: 'Open Sans', sans-serif;
            font-weight: lighter;
            color: #999999;
            background: #fafafa;
            height: 40px;
            width: calc(100% - 28px);
            margin-left: 28px;
          }
        }
      }

      .scrollable-content {
        height: calc(100vh - (40vh + 163px));
        overflow: auto;
    
        .item {
          display: flex;
          flex: 1;
          align-items: center;
          border-bottom: 1px solid #999999;
          padding: 9px 0px 9px 15px;
      
          :last-child {
            border-bottom: none;
          }
    
          .thumb {
            border: 1px solid #999999;
            width: 40px;
            height: 40px;
            color: #333;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #dadada;
          }
    
          .middle {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 0 15px;
    
            .userId {
              font-size: 8px;
              font-weight: 600;
              color: #666666;
              margin-bottom: 4px;
            }
            .userName {
              font-size: 20px;
              color: #666666;
              text-transform: capitalize;
            }
          }
    
          .right {
            margin-top: -15px;

            .checkmark {
              border-radius: 0px;
              border: 2px solid #333;
              background-color: #FFF;
            }
          }
        }
      }
    }
  }
`;

type TaskUserAssignmentProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
};

const TaskUserAssignment: FC<TaskUserAssignmentProps> = ({
  closeAllModals,
  closeModal,
  taskId,
}) => {
  const { list, pageable } = useTypedSelector(
    (state) => state.users.users.active,
  );
  const {
    tasks: { tasksById },
  } = useTypedSelector((state) => state.composer);

  const task = tasksById[taskId];
  const {
    taskExecution: { assignees },
  } = task;

  const scroller = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialUsers, setInitialUsers] = useState<Users | null>(null);
  const prevSearch = usePrevious(searchQuery);

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

  let isLast = true;
  let currentPage = 0;
  if (pageable) {
    isLast = pageable?.last;
    currentPage = pageable?.page;
  }

  useEffect(() => {
    if (!initialUsers) {
      setInitialUsers(assignees);
    }
    if (prevSearch !== searchQuery) {
      fetchData(0, 10);
    }
    if (scroller && scroller.current) {
      const div = scroller.current;
      div.addEventListener('scroll', handleOnScroll);
      return () => {
        div.removeEventListener('scroll', handleOnScroll);
      };
    }
  }, [searchQuery, isLast, currentPage]);

  const handleOnScroll = (e: Record<string, any>) => {
    if (scroller && scroller.current && e.target) {
      if (
        e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight &&
        !isLast
      ) {
        fetchData(currentPage + 1, 10);
      }
    }
  };

  const topViews: JSX.Element[] = [];
  const bottomViews: JSX.Element[] = [];

  const dispatch = useDispatch();
  const userRow = (user: User, index: number, checked: boolean) => (
    <div className="item" key={`user_${index}`}>
      <div className="right">
        <Checkbox
          checked={checked}
          label=""
          onClick={() => {
            console.log('changed', checked);
            if (checked) {
              //   dispatch(unAssignUser({ user, selectedJobIndex }));
            } else {
              //   dispatch(assignUser({ user, selectedJobIndex }));
            }
          }}
        />
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

  assignees.forEach((user, index) => {
    topViews.push(userRow(user, index, true));
  });

  if (list) {
    list.forEach((user, index) => {
      const checked = assignees.some((item) => item.id === user.id);
      if (!checked && user.id !== 0) {
        bottomViews.push(userRow(user, index, checked));
      }
    });
  }

  const jobUsersLength: number = assignees.length || 0;
  let showButtons = false;
  if (initialUsers && initialUsers !== assignees) showButtons = true;

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={() => {
          closeModal();
        }}
        title="Assign this Task"
        primaryText="Confirm"
        secondaryText="Cancel"
        onSecondary={() => {
          closeModal();
        }}
        onPrimary={() => {
          closeModal();
        }}
        showPrimary={showButtons}
        showSecondary={showButtons}
        modalFooterOptions={
          <span
            style={{
              color: `#1d84ff`,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
            onClick={() => {
              closeModal();
            }}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
            />
          </div>
          <span>Unselect All</span>
        </div>
        <div className="scrollable-content" ref={scroller}>
          {topViews}
          {bottomViews}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskUserAssignment;
