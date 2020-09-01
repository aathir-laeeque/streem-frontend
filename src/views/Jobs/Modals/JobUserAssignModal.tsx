import { BaseModal, Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { fetchUsers } from '#store/users/actions';
import { User, Users } from '#store/users/types';
import { capitalizeFirstLetter, getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Search } from '@material-ui/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { assignUser, unAssignUser } from '../ListView/actions';
import { ListViewState } from '../ListView/types';

export interface JobUserAssignModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedJobIndex: number;
  refreshData: () => void;
}

const Wrapper = styled.div.attrs({})`
  .modal-body {
    padding: 0 !important;
  }
  .item {
    display: flex;
    flex: 1;
    align-items: center;
    border-bottom: 1px solid #999999;
    padding: 9px 0px 9px 15px;

    :last-child {
      border-bottom: none;
    }
  }
  .middle {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 15px;
  }
  .right {
    margin-top: -15px;
  }
  .userId {
    font-size: 8px;
    font-weight: 600;
    color: #666666;
    margin-bottom: 4px;
  }
  .userName {
    font-size: 20px;
    color: #666666;
  }
  .thumb {
    border: 1px solid #999999;
    width: 40px;
    height: 40px;
    opacity: 0.6;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dadada;
  }
  .top-content {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    padding: 8px 15px 15px 15px;
  }
  .selected-text {
    font-size: 14px;
    color: #999999;
  }
  .searchboxwrapper {
    position: relative;
  }
  .searchbox {
    border: none;
    border-bottom: 1px solid #999999;
    outline: none;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    color: #999999;
    width: 180px;
    height: 29px;
    background: #fff;
  }
  .searchsubmit {
    width: 14px;
    height: 29px;
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border: none;
    border-bottom: 1px solid #999999;
    color: #999999;
    cursor: pointer;
  }
  .scrollable-content {
    height: calc(100vh - (40vh + 163px));
    overflow: auto;
  }
`;

export const JobUserAssignModal: FC<JobUserAssignModalProps> = ({
  closeAllModals,
  closeModal,
  selectedJobIndex,
  refreshData,
}) => {
  const { list, pageable } = useTypedSelector(
    (state) => state.users.users.active,
  );
  const { jobs, selectedStatus }: Partial<ListViewState> = useTypedSelector(
    (state) => state.jobListView,
  );
  const job = jobs[selectedStatus].list[selectedJobIndex];

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
      setInitialUsers(job.assignees);
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
      <div className="thumb">
        {getInitials(`${user.firstName} ${user.lastName}`)}
      </div>
      <div className="middle">
        <span className="userId">{user.id}</span>
        <span className="userName">{`${capitalizeFirstLetter(
          user.firstName,
        )} ${capitalizeFirstLetter(user.lastName)}`}</span>
      </div>
      <div className="right">
        <Checkbox
          checked={checked}
          label=""
          onClick={() => {
            console.log('changed');
            if (checked) {
              dispatch(unAssignUser({ user, selectedJobIndex }));
            } else {
              dispatch(assignUser({ user, selectedJobIndex }));
            }
          }}
        />
      </div>
    </div>
  );

  job.assignees.forEach((user, index) => {
    topViews.push(userRow(user, index, true));
  });

  console.log('list', list);

  if (list) {
    list.forEach((user, index) => {
      const checked = job.assignees.some((item) => item.id === user.id);
      if (!checked) {
        bottomViews.push(userRow(user, index, checked));
      }
    });
  }

  const jobUsersLength: number = job.assignees.length || 0;
  let showButtons = false;
  if (initialUsers && initialUsers !== job.assignees) showButtons = true;

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={() => {
          refreshData();
          closeModal();
        }}
        title="Assigning a Job"
        primaryText="Notify"
        secondaryText="Continue Without Notifying"
        onSecondary={() => {
          refreshData();
          closeModal();
        }}
        onPrimary={() => {
          refreshData();
          closeModal();
          refreshData;
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
              refreshData();
              closeModal();
            }}
          >
            Go Back
          </span>
        }
      >
        <div className="top-content">
          <div>
            <span className="selected-text">
              {jobUsersLength} {(jobUsersLength > 1 && 'users') || 'user'}{' '}
              selected.
            </span>
          </div>
          <div className="searchboxwrapper">
            <input
              className="searchbox"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
            />
            <Search className="searchsubmit" />
          </div>
        </div>
        <div className="scrollable-content" ref={scroller}>
          {topViews}
          {bottomViews}
        </div>
      </BaseModal>
    </Wrapper>
  );
};
