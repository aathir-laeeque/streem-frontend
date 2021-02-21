import { Button1, SearchFilter, TabContentProps } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ExtraColumn, NewListView } from '#components/shared/NewListView';
import checkPermission, { roles } from '#services/uiPermissions';
import { UserState } from '#services/users';
import { useTypedSelector } from '#store/helpers';
import { fetchUsers, setSelectedUser } from '#store/users/actions';
import { User } from '#store/users/types';
import { FilterField } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { ArrowLeft, ArrowRight, FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { startCase, toLower } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { removeUnderscore } from '../../../utils/stringUtils';
import {
  archiveUser,
  cancelInvite,
  resendInvite,
  unArchiveUser,
  unLockUser,
} from '../actions';
import { TabContentWrapper } from './styles';

export function modalBody(user: User, text: string) {
  return (
    <div className="body-content" style={{ textAlign: 'left' }}>
      {text}
      <span
        style={{ fontWeight: 'bold' }}
      >{` ${user.firstName} ${user.lastName}`}</span>
      .
    </div>
  );
}

const DEFAULT_PAGE_SIZE = 10;

const TabContent: React.FC<TabContentProps> = (props) => {
  const {
    users: {
      [props.values[0] as UserState]: { pageable },
      currentPageData,
    },
  } = useTypedSelector((state) => state);

  const dispatch = useDispatch();

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const fetchData = (page: number, size: number) => {
    dispatch(
      fetchUsers(
        {
          page,
          size,
          archived: props.values[0] === UserState.ACTIVE ? false : true,
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
          body: modalBody(user, 'You’re about to archive'),
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
          body: modalBody(user, 'You’re about to unarchive'),
        },
      }),
    );
  };

  const onResendInvite = (id: User['id']) => {
    dispatch(resendInvite({ id }));
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
          body: modalBody(user, 'You are about to cancel the invite sent to'),
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
          body: modalBody(user, 'You’re about to unlock the account of'),
        },
      }),
    );
  };

  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
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
        props.values[0] === UserState.ACTIVE ? (
          <Button1
            id="add-user"
            onClick={() => navigate('user-access/add-user')}
          >
            Add a new User
          </Button1>
        ) : null}
      </div>
      <NewListView
        properties={[]}
        data={currentPageData}
        beforeColumns={
          [
            {
              header: 'Name',
              template: function renderComp(item: User) {
                return (
                  <div className="list-card-columns">
                    <span
                      className="list-title"
                      onClick={() => {
                        dispatch(setSelectedUser(item));
                        navigate(`/user-access/edit-user`);
                      }}
                    >
                      {getFullName(item)}
                    </span>
                  </div>
                );
              },
            },
            {
              header: 'Employee ID',
              template: function renderComp(item: User) {
                return (
                  <div className="list-card-columns">{item.employeeId}</div>
                );
              },
            },
            {
              header: 'Email ID',
              template: function renderComp(item: User) {
                return <div className="list-card-columns">{item.email}</div>;
              },
            },
            {
              header: 'Roles',
              template: function renderComp(item: User) {
                return (
                  <div className="list-card-columns">
                    {removeUnderscore(
                      item?.roles
                        ?.map((role) => startCase(toLower(role.name)))
                        .join(' ,') || '',
                    )}
                  </div>
                );
              },
            },
            {
              header: 'Status',
              template: function renderComp(item: User) {
                return (
                  <div className="list-card-columns">
                    {(() => {
                      if (!item.verified) {
                        return (
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <FiberManualRecord
                              className="icon"
                              style={{ color: '#f7b500' }}
                            />
                            Unregistered
                          </div>
                        );
                      } else if (item.blocked) {
                        return (
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <FiberManualRecord
                              className="icon"
                              style={{ color: '#ff6b6b' }}
                            />
                            Locked
                          </div>
                        );
                      } else if (!item.archived) {
                        return <span>Active</span>;
                      } else if (item.archived) {
                        return null;
                      }
                    })()}
                  </div>
                );
              },
            },
            {
              header: '',
              template: function renderComp(item: User) {
                return (
                  <div className="list-card-columns">
                    {(() => {
                      if (
                        checkPermission(['usersAndAccess', 'listViewActions'])
                      ) {
                        const isItemAccountOwner = item?.roles?.some(
                          (i) => i?.name === roles.ACCOUNT_OWNER,
                        );

                        let editAccountOwner = true;
                        if (isItemAccountOwner)
                          editAccountOwner = checkPermission([
                            'usersAndAccess',
                            'editAccountOwner',
                          ]);
                        if (item.archived && !isItemAccountOwner) {
                          return (
                            <span
                              className="list-title"
                              onClick={() => onUnArchiveUser(item)}
                            >
                              Unarchive
                            </span>
                          );
                        } else if (!isItemAccountOwner && !item.verified) {
                          return (
                            <>
                              <span
                                className="list-title"
                                onClick={() => onResendInvite(item.id)}
                                style={{ color: '#1d84ff' }}
                              >
                                Resend Invite
                              </span>
                              <span
                                className="list-title"
                                onClick={() => onCancelInvite(item)}
                                style={{ color: '#ff6b6b', marginLeft: '12px' }}
                              >
                                Cancel Invite
                              </span>
                            </>
                          );
                        } else if (editAccountOwner && item.blocked) {
                          return (
                            <span
                              className="list-title"
                              onClick={() => onUnlockUser(item)}
                            >
                              Unblock
                            </span>
                          );
                        } else if (!isItemAccountOwner) {
                          return (
                            <span
                              className="list-title"
                              onClick={() => onArchiveUser(item)}
                            >
                              Archive
                            </span>
                          );
                        }
                      } else {
                        return null;
                      }
                    })()}
                  </div>
                );
              },
            },
          ] as ExtraColumn[]
        }
      />

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
