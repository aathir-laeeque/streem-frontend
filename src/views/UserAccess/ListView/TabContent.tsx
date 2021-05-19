import { Button1, DataTable, SearchFilter, TabContentProps } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission, { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store/helpers';
import { fetchUsers } from '#store/users/actions';
import {
  User,
  UsersListType,
  UserStates,
  UserStatesColors,
  UserStatesContent,
} from '#store/users/types';
import { FilterField } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { TabContentWrapper } from '#views/Jobs/NewListView/styles';
import { Menu, MenuItem } from '@material-ui/core';
import {
  ArrowDropDown,
  ArrowLeft,
  ArrowRight,
  FiberManualRecord,
} from '@material-ui/icons';
import { navigate } from '@reach/router';
import { startCase, toLower } from 'lodash';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { removeUnderscore } from '../../../utils/stringUtils';
import {
  archiveUser,
  cancelInvite,
  resendInvite,
  unArchiveUser,
  unLockUser,
} from '../actions';

export function modalBody(text: string, user?: User) {
  return (
    <div className="body-content" style={{ textAlign: 'left' }}>
      {text}
      {user && (
        <span
          style={{ fontWeight: 'bold' }}
        >{` ${user.firstName} ${user.lastName}.`}</span>
      )}
    </div>
  );
}

const DEFAULT_PAGE_SIZE = 10;

const TabContent: React.FC<TabContentProps> = (props) => {
  const {
    users: {
      [props.values[0] as UsersListType]: { pageable },
      currentPageData,
    },
  } = useTypedSelector((state) => state);

  const dispatch = useDispatch();

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = (page: number, size: number) => {
    dispatch(
      fetchUsers(
        {
          page,
          size,
          archived: props.values[0] === UsersListType.ACTIVE ? false : true,
          sort: 'createdAt,desc',
          filters: JSON.stringify({ op: 'AND', fields: filterFields }),
        },
        props.values[0],
      ),
    );
  };

  useEffect(() => {
    fetchData(0, 10);
  }, [props.values, filterFields]);

  const onArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Archiving a User',
          primaryText: 'Archive User',
          onPrimary: () =>
            dispatch(
              archiveUser({
                id: user.id,
                fetchData: () => {
                  fetchData(0, 10);
                },
              }),
            ),
          body: modalBody('You’re about to archive', user),
        },
      }),
    );
  };

  const onUnArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Unarchiving a User',
          primaryText: 'Unarchive User',
          onPrimary: () =>
            dispatch(
              unArchiveUser({
                id: user.id,
                fetchData: () => {
                  fetchData(0, 10);
                },
              }),
            ),
          body: modalBody('You’re about to unarchive', user),
        },
      }),
    );
  };

  const onCancelInvite = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Cancel Pending Invite',
          primaryText: 'Cancel Invite',
          onPrimary: () =>
            dispatch(
              cancelInvite({
                id: user.id,
                fetchData: () => {
                  fetchData(0, 10);
                },
              }),
            ),
          body: modalBody('You are about to cancel the invite sent to', user),
        },
      }),
    );
  };

  const onUnlockUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Unlocking a User',
          primaryText: 'Unlock User',
          onPrimary: () =>
            dispatch(
              unLockUser({
                id: user.id,
                fetchData: () => {
                  fetchData(0, 10);
                },
              }),
            ),
          body: modalBody('You’re about to unlock the account of', user),
        },
      }),
    );
  };

  const showPaginationArrows = pageable.totalPages > 10;

  const columns = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 240,
      format: function renderComp(item: User) {
        const fullName = getFullName(item);
        return (
          <span
            className="primary"
            onClick={() => navigate(`/users/edit/${item.id}`)}
            title={fullName}
          >
            {fullName}
          </span>
        );
      },
    },
    {
      id: 'employeeId',
      label: 'Employee ID',
      minWidth: 152,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 152,
      format: function renderComp({ email }: User) {
        return (
          <div title={email} style={{ textTransform: 'lowercase' }}>
            {email}
          </div>
        );
      },
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 152,
      format: function renderComp(item: User) {
        const userRolesString = removeUnderscore(
          item?.roles
            ?.map((role) => startCase(toLower(role.name)))
            .join(', ') || '',
        );
        return <span title={userRolesString}>{userRolesString}</span>;
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 152,
      format: function renderComp(item: User) {
        return (() => {
          if (item.archived) {
            return <span title="Archived">Archived</span>;
          } else {
            return (
              <div
                title={UserStatesContent[item.state]}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <FiberManualRecord
                  className="icon"
                  style={{ color: UserStatesColors[item.state] }}
                />
                {UserStatesContent[item.state]}
              </div>
            );
          }
        })();
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 152,
      format: function renderComp(item: User) {
        return showButtons(item);
      },
    },
  ];
  const isUserLocked = (state: UserStates) =>
    [
      UserStates.UNREGISTERED_LOCKED,
      UserStates.REGISTERED_LOCKED,
      UserStates.ACCOUNT_LOCKED,
    ].includes(state);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ArchiveButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        onArchiveUser(selectedUser as User);
      }}
    >
      <div className="list-item">
        <span>Archive</span>
      </div>
    </MenuItem>
  );

  const UnArchiveButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        onUnArchiveUser(selectedUser as User);
      }}
    >
      <div className="list-item">
        <span>Unarchive</span>
      </div>
    </MenuItem>
  );

  const UnlockButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        onUnlockUser(selectedUser as User);
      }}
    >
      <div className="list-item">
        <span>Unlock</span>
      </div>
    </MenuItem>
  );

  const ResendInviteButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        dispatch(resendInvite({ id: (selectedUser as User).id }));
      }}
    >
      <div className="list-item">
        <span>Resend Invite</span>
      </div>
    </MenuItem>
  );

  const CancelInviteButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        onCancelInvite(selectedUser as User);
      }}
    >
      <div className="list-item">
        <span>Cancel Invite</span>
      </div>
    </MenuItem>
  );

  const GenerateNewSecretButton = () => (
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        dispatch(resendInvite({ id: (selectedUser as User).id }));
      }}
    >
      <div className="list-item">
        <span>Generate New Secret Key</span>
      </div>
    </MenuItem>
  );

  const showButtons = (item: User) => {
    const isItemAccountOwner = item?.roles?.some(
      (i) => i?.name === roles.ACCOUNT_OWNER,
    );

    if (isItemAccountOwner) {
      if (
        isUserLocked(item.state) &&
        checkPermission(['usersAndAccess', 'editAccountOwner'])
      )
        return (
          <>
            <div
              className="list-card-columns"
              id="more-actions"
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                setAnchorEl(event.currentTarget);
                setSelectedUser(item);
              }}
            >
              More <ArrowDropDown className="icon" />
            </div>
            <Menu
              id="row-more-actions"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: 30 }}
            >
              <UnlockButton />
            </Menu>
          </>
        );
      return null;
    }

    return (
      <>
        <div
          className="list-card-columns"
          id="more-actions"
          onClick={(event: MouseEvent<HTMLDivElement>) => {
            setAnchorEl(event.currentTarget);
            setSelectedUser(item);
          }}
        >
          More <ArrowDropDown className="icon" />
        </div>
        <Menu
          id="row-more-actions"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ marginTop: 30 }}
        >
          {(() => {
            if (selectedUser?.archived) {
              return <UnArchiveButton />;
            } else {
              return (
                <div>
                  {(() => {
                    switch (selectedUser?.state) {
                      case UserStates.ACCOUNT_LOCKED:
                        return <UnlockButton />;
                      case UserStates.INVITE_CANCELLED:
                        return (
                          <>
                            <ArchiveButton />
                            <ResendInviteButton />
                          </>
                        );
                      case UserStates.INVITE_EXPIRED:
                        return (
                          <>
                            <ArchiveButton />
                            <ResendInviteButton />
                          </>
                        );
                      case UserStates.REGISTERED_LOCKED:
                        return (
                          <>
                            <ArchiveButton />
                            <UnlockButton />
                          </>
                        );
                      case UserStates.UNREGISTERED:
                        return (
                          <>
                            <GenerateNewSecretButton />
                            <CancelInviteButton />
                          </>
                        );
                      case UserStates.UNREGISTERED_LOCKED:
                        return (
                          <>
                            <ArchiveButton />
                            <UnlockButton />
                          </>
                        );
                      default:
                        return <ArchiveButton />;
                    }
                  })()}
                </div>
              );
            }
          })()}
        </Menu>
      </>
    );
  };

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          key={props.label}
          showdropdown
          dropdownOptions={[
            {
              label: 'First Name',
              value: 'firstName',
              field: 'firstName',
              operator: 'LIKE',
            },
            {
              label: 'Last Name',
              value: 'lastName',
              field: 'lastName',
              operator: 'LIKE',
            },
            {
              label: 'Employee ID',
              value: 'employeeId',
              field: 'employeeId',
              operator: 'LIKE',
            },
            {
              label: 'Email',
              value: 'email',
              field: 'email',
              operator: 'LIKE',
            },
          ]}
          updateFilterFields={(fields) => setFilterFields([...fields])}
        />

        {checkPermission(['usersAndAccess', 'addNewUser']) &&
        props.values[0] === UsersListType.ACTIVE ? (
          <Button1 id="create" onClick={() => navigate('users/add')}>
            Add a new User
          </Button1>
        ) : null}
      </div>

      <DataTable columns={columns} rows={currentPageData} />

      <div className="pagination">
        <ArrowLeft
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page > 0) {
              fetchData(pageable.page - 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
        {Array.from({ length: pageable.totalPages }, (_, i) => i)
          .slice(
            Math.floor(pageable.page / 10) * 10,
            Math.floor(pageable.page / 10) * 10 + 10,
          )
          .map((el) => (
            <span
              key={el}
              className={pageable.page === el ? 'active' : ''}
              onClick={() => fetchData(el, DEFAULT_PAGE_SIZE)}
            >
              {el + 1}
            </span>
          ))}
        <ArrowRight
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page < pageable.totalPages - 1) {
              fetchData(pageable.page + 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
