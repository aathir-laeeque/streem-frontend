import { Checkbox } from '#components';
import {
  closeOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { defaultParams, useUsers } from '#services/users';
import { User } from '#store/users/types';
import { FilterOperators } from '#utils/globalTypes';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Popover } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp, Search } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-left: 16px;
  position: relative;
  width: 332px;

  .select-label {
    color: #161616;
    display: block;
    font-size: 12px;
    line-height: 1.33;
    letter-spacing: 0.32px;
    margin-bottom: 8px;

    .optional-badge {
      color: #999999;
      font-size: 12px;
      margin-left: 4px;
    }
  }

  .button {
    align-items: center;
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;
    cursor: pointer;
    display: flex;

    span {
      &.placeholder-text {
        color: #000;
        font-size: 14px;
        padding: 11px 16px;
      }

      &.selected-option {
        color: #000000;
      }
    }

    > .icon {
      font-size: 18px;
      margin-left: auto;
    }

    #select-button-icon {
      margin-left: 0;
      margin-right: 12px;
    }
    .task-assignees {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 16px;

      > span {
        font-size: 14px;
        color: #999999;
      }

      > div {
        display: flex;

        .user-thumb {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          border: solid 1px #fff;
          align-items: center;
          background-color: #eeeeee;
          justify-content: center;
          display: flex;
          color: #1d84ff;
          margin-right: -5px;
          font-size: 13px;
          cursor: pointer;
        }
      }
    }
  }
`;

const PopoverWrapper = styled.div`
  min-height: 360px;
  height: 360px;
  width: 330px;

  .top-content {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    padding: 16px 0px 16px;
    margin: 0px 16px;

    span {
      padding: 4px 16px;
      color: #1d84ff;
      font-size: 14px;
      cursor: pointer;
    }

    .searchboxwrapper {
      position: relative;
      flex: 1;
      padding: 0px 13px;
      background-color: transparent;
      border-bottom: 1px solid #bababa;

      svg {
        background: transparent;
        border: 0;
        height: 40px;
        width: 20px;
        right: unset;
        color: #000;
        position: absolute;
        left: 16px;
        top: 0;
      }

      .searchbox {
        border: none;
        outline: none;
        font-size: 14px;
        color: #999999;
        background: transparent;
        height: 40px;
        width: calc(100% - 28px);
        margin-left: 28px;

        ::-webkit-input-placeholder {
          color: #bababa;
        }
      }
    }
  }

  .scrollable-content {
    height: 285px;
    overflow: auto;

    .item {
      display: flex;
      flex: 1;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      padding: 9px 0px 9px 15px;

      :last-child {
        border-bottom: none;
      }

      .thumb {
        border: 1px solid #fff;
        width: 40px;
        height: 40px;
        color: #1d84ff;
        border-radius: 18px;
        display: flex;
        font-weight: 600;
        align-items: center;
        justify-content: center;
        background-color: #ecedf1;
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
          font-size: 18px;
          color: #666666;
          text-transform: capitalize;
        }
      }

      .right {
        margin-top: -15px;

        .checkmark {
          border-radius: 0px;
          border-color: #333;
          background-color: #fff;
          border-width: 2px;
        }

        .container input:checked ~ .checkmark {
          background-color: #1d84ff;
          border: none;
        }

        .container input:disabled ~ .checkmark {
          background-color: #eeeeee;
          border: none;
        }
      }
    }
  }
`;

type UsersFilterProps = {
  options: User[];
  updateFilter: (option: User[]) => void;
  label?: string;
};

type initialState = {
  searchQuery: string;
  selectedUsers: User[];
  appliedUsers: User[];
  anchorEl: HTMLButtonElement | null;
};

const UsersFilter: FC<UsersFilterProps> = ({
  options,
  updateFilter,
  label,
}) => {
  const initialState: initialState = {
    searchQuery: '',
    selectedUsers: [],
    appliedUsers: options,
    anchorEl: null,
  };

  const {
    users: list,
    loadMore,
    loadAgain,
  } = useUsers({
    params: defaultParams(false),
  });
  const [state, setstate] = useState(initialState);
  const { searchQuery, selectedUsers, appliedUsers, anchorEl } = state;
  const dispatch = useDispatch();
  const prevSearch = usePrevious(searchQuery);

  useEffect(() => {
    setstate((prev) => ({ ...prev, appliedUsers: options, selectedUsers: [] }));
  }, [options]);

  useEffect(() => {
    if (prevSearch !== searchQuery) {
      loadAgain({
        newParams: {
          ...defaultParams(),
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              {
                field: 'firstName',
                op: FilterOperators.LIKE,
                values: [searchQuery],
              },
            ],
          }),
        },
      });
    }
  }, [searchQuery]);

  const onCheckChanged = (user: User, checked: boolean) => {
    if (checked) {
      const newSelected = [...appliedUsers, ...selectedUsers].filter(
        (u) => user.id !== u.id,
      );
      setstate({ ...state, selectedUsers: newSelected });
      updateFilter([...newSelected]);
    } else {
      setstate({ ...state, selectedUsers: [...selectedUsers, user] });
      updateFilter([...appliedUsers, ...[...selectedUsers, user]]);
    }
  };

  const userRow = (user: User, checked: boolean) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          <Checkbox
            checked={checked}
            label=""
            onClick={() => onCheckChanged(user, checked)}
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
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7)
      loadMore();
  };

  const handleUnselectAll = () => {
    setstate({ ...state, selectedUsers: [], appliedUsers: [] });
    updateFilter([]);
  };

  const bodyView: JSX.Element[] = [];

  if (list) {
    if (searchQuery === '') {
      appliedUsers.forEach((user) => {
        bodyView.push(userRow(user, true));
      });
    }

    (list as unknown as Array<User>).forEach((user) => {
      const isSelected = selectedUsers.some((item) => item.id === user.id);
      const inApplied = appliedUsers.some((item) => item.id === user.id);
      if (user.id !== '0') {
        if (!inApplied) {
          bodyView.push(userRow(user, isSelected));
        }
      }
    });
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setstate({ ...state, anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setstate({ ...state, anchorEl: null });
  };

  const handleAssigneeClick = (event: MouseEvent, users: User[]) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.ASSIGNED_USER_DETAIL,
        popOverAnchorEl: event.currentTarget || undefined,
        props: {
          users,
        },
      }),
    );
  };

  return (
    <Wrapper>
      <label className="select-label">{label}</label>

      <div className="button" onClick={(e) => handleClick(e)}>
        {appliedUsers.length > 0 ? (
          <div className="task-assignees">
            <div>
              {appliedUsers.slice(0, 4).map((user) => (
                <div
                  key={`assignee_${user.id}`}
                  className="user-thumb"
                  aria-haspopup="true"
                  onMouseEnter={(e) => handleAssigneeClick(e, [user])}
                  onMouseLeave={() =>
                    dispatch(
                      closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL),
                    )
                  }
                >
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </div>
              ))}
              {appliedUsers.length > 8 && (
                <div
                  key={`assignee_length`}
                  className="user-thumb"
                  aria-haspopup="true"
                  onMouseEnter={(e) =>
                    handleAssigneeClick(e, appliedUsers.slice(4))
                  }
                  onMouseLeave={() =>
                    dispatch(
                      closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL),
                    )
                  }
                >
                  +{appliedUsers.length - 8}
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="placeholder-text">Select Assignees</span>
        )}

        {anchorEl ? (
          <ArrowDropUp className="icon" />
        ) : (
          <ArrowDropDown className="icon" />
        )}
      </div>
      <Popover
        id={anchorEl ? 'user-filter-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <PopoverWrapper>
          <div className="top-content">
            <div className="searchboxwrapper">
              <Search className="searchsubmit" />
              <input
                className="searchbox"
                type="text"
                onChange={(e) =>
                  setstate({ ...state, searchQuery: e.target.value })
                }
                defaultValue={searchQuery}
                placeholder="Search Users"
              />
            </div>
            <span onClick={handleUnselectAll}>Unselect All</span>
          </div>
          <div className="scrollable-content" onScroll={handleOnScroll}>
            {bodyView}
          </div>
        </PopoverWrapper>
      </Popover>
    </Wrapper>
  );
};

export default UsersFilter;
