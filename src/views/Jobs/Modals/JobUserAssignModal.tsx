import { BaseModal, Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { User } from '#store/users/types';
import { capitalizeFirstLetter, getInitials } from '#utils/stringUtils';
import { Search } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { assignUser } from '../ListView/actions';
import { ListViewState } from '../ListView/types';

interface JobUserAssignModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedJobIndex: number;
  users: User[];
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
  .top-action {
    font-style: italic;
    color: #12aab3;
    font-size: 14px;
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
  users,
  selectedJobIndex,
}) => {
  const { jobs, selectedStatus }: Partial<ListViewState> = useTypedSelector(
    (state) => state.jobListView,
  );
  const job = jobs[selectedStatus].list[selectedJobIndex];
  const dispatch = useDispatch();
  const totalUsers = users.length;
  const onAssignJob = () => {
    console.log('onAssignJob');
  };
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        title="Assigning a Job"
        successText="Notify"
        cancelText="Go Back"
        onSuccess={onAssignJob}
        modalFooterOptions={
          <span style={{ color: `#12aab3`, fontWeight: 600, fontSize: 14 }}>
            Continue Without Notifying
          </span>
        }
      >
        <div className="top-content">
          <div>
            <span className="selected-text">
              {job.users.length} of {totalUsers} users selected{' '}
            </span>
            {/* <span className="top-action">Unselect all</span> */}
          </div>
          <div className="searchboxwrapper">
            <input className="searchbox" type="text" placeholder="Search" />
            <Search className="searchsubmit" />
          </div>
        </div>
        <div className="scrollable-content">
          {users.map((user, index) => {
            const checked = job.users.some((item) => item.id === user.id);
            return (
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
                      if (checked) {
                        // dispatch(assignUser({ user, selectedJobIndex }));
                        console.log('Already Checked');
                      } else {
                        dispatch(assignUser({ user, selectedJobIndex }));
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </BaseModal>
    </Wrapper>
  );
};
