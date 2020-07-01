import { BaseModal, Checkbox } from '#components';
import { User } from '#store/users/types';
import { Task } from '#views/Tasks/types';
import React, { FC, useState } from 'react';
import { Search } from '@material-ui/icons';
import styled from 'styled-components';

interface TaskUserAssignModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedTask: Task;
  users: User[];
  onAssignTask: () => void;
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
`;

const getInitials = (name: string): string => {
  let initials: RegExpMatchArray | string = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const TaskUserAssignModal: FC<TaskUserAssignModalProps> = ({
  closeAllModals,
  closeModal,
  users,
  onAssignTask,
  selectedTask,
}) => {
  const totalUsers = users.length;
  const [selectedCount, setSelectedCount] = useState(0);
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        title="Assigning a Task"
        successText="Done"
        cancelText="Go Back"
        onSuccess={() => onAssignTask()}
      >
        <div className="top-content">
          <div>
            <span className="selected-text">
              {selectedCount} of {totalUsers} users selected{' '}
            </span>
            <span className="top-action">Unselect all</span>
          </div>
          <div className="searchboxwrapper">
            <input className="searchbox" type="text" placeholder="Search" />
            <Search className="searchsubmit" />
          </div>
        </div>
        {users.map((user, index) => (
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
                label=""
                onClick={() => {
                  setSelectedCount(selectedCount + 1);
                }}
              />
            </div>
          </div>
        ))}
      </BaseModal>
    </Wrapper>
  );
};
