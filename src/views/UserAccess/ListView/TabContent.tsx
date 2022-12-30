import {
  Button,
  DataTable,
  ListActionMenu,
  PaginatedFetchData,
  Pagination,
  SearchFilter,
  TabContentProps,
} from '#components';
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
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { CircularProgress, MenuItem } from '@material-ui/core';
import { ArrowDropDown, FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { startCase, toLower } from 'lodash';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUnderscore } from '../../../utils/stringUtils';
import { archiveUser, cancelInvite, resendInvite, unArchiveUser, unLockUser } from '../actions';
export function modalBody(text: string, user?: User) {
  return (
    <div className="body-content" style={{ textAlign: 'left' }}>
      {text}
      {user && <span style={{ fontWeight: 'bold' }}>{` ${user.firstName} ${user.lastName}.`}</span>}
    </div>
  );
}

const TabContent: React.FC<TabContentProps> = (props) => {
  const {
    users: {
      [props.values[0] as UsersListType]: { pageable },
      currentPageData,
      loading,
    },
  } = useTypedSelector((state) => state);

  const dispatch = useDispatch();

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchUsers(
        {
          page,
          size,
          archived: props.values[0] === UsersListType.ACTIVE ? false : true,
          sort: 'createdAt,desc',
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: filterFields,
          }),
        },
        props.values[0],
      ),
    );
  };

  useEffect(() => {
    fetchData();
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
                fetchData,
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
                fetchData,
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
                fetchData,
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
                fetchData,
              }),
            ),
          body: modalBody('You’re about to unlock the account of', user),
        },
      }),
    );
  };

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
            style={{ textTransform: 'capitalize' }}
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
          item?.roles?.map((role) => startCase(toLower(role.name))).join(', ') || '',
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
    ...(checkPermission(['usersAndAccess', 'listViewActions'])
      ? [
          {
            id: 'actions',
            label: 'Actions',
            minWidth: 152,
            format: function renderComp(item: User) {
              return showButtons(item);
            },
          },
        ]
      : []),
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
        <span>Reset Invite</span>
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
    const isItemAccountOwner = item?.roles?.some((i) => i?.name === roles.ACCOUNT_OWNER);

    if (isItemAccountOwner) {
      if (isUserLocked(item.state) && checkPermission(['usersAndAccess', 'editAccountOwner']))
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
            <ListActionMenu
              id="row-more-actions"
              anchorEl={anchorEl}
              keepMounted
              disableEnforceFocus
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: 30 }}
            >
              <UnlockButton />
            </ListActionMenu>
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
        <ListActionMenu
          id="row-more-actions"
          anchorEl={anchorEl}
          keepMounted
          disableEnforceFocus
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
        </ListActionMenu>
      </>
    );
  };

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          label={props.label}
          showDropdown
          dropdownOptions={[
            {
              label: 'First Name',
              value: 'firstName',
              field: 'firstName',
              operator: FilterOperators.LIKE,
            },
            {
              label: 'Last Name',
              value: 'lastName',
              field: 'lastName',
              operator: FilterOperators.LIKE,
            },
            {
              label: 'Employee ID',
              value: 'employeeId',
              field: 'employeeId',
              operator: FilterOperators.LIKE,
            },
            {
              label: 'Email',
              value: 'email',
              field: 'email',
              operator: FilterOperators.LIKE,
            },
          ]}
          updateFilterFields={(fields) => setFilterFields([...fields])}
        />

        {checkPermission(['usersAndAccess', 'addNewUser']) &&
        props.values[0] === UsersListType.ACTIVE ? (
          <Button id="create" onClick={() => navigate('users/add')}>
            Add a new User
          </Button>
        ) : null}
      </div>

      <div
        style={{
          display: loading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
      </div>
      <div style={{ ...(loading ? { display: 'none' } : { display: 'contents' }) }}>
        <DataTable columns={columns} rows={currentPageData} />
        <Pagination pageable={pageable} fetchData={fetchData} />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
