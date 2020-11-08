import { NewListView } from '#components/shared/NewListView';
import { UserState } from '#services/users';
import { User } from '#services/users/types';
import { useTypedSelector } from '#store/helpers';
import { fetchUsers, setSelectedUser } from '#store/users/actions';
import { getFullName } from '#utils/stringUtils';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiberManualRecord, ArrowLeft, ArrowRight } from '@material-ui/icons';

import { TabContentWrapper } from './styles';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import {
  archiveUser,
  unArchiveUser,
  resendInvite,
  cancelInvite,
} from '../actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { unLockUser } from '../actions';

export function modalBody(user: User, text: string): any {
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

const NewTabContent = (props) => {
  console.log('props :: ', props);

  const {
    users: {
      loading,
      [props.values[0]]: { list, pageable },
    },
    auth: { isIdle },
  } = useTypedSelector((state) => state);

  const dispatch = useDispatch();

  const [filterFields, setFilterFields] = useState([]);

  console.log('users :: ', list);

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
  }, [props.values]);

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

  const onCancelInvite = (id: User['id']) => {
    dispatch(
      cancelInvite({
        id,
        fetchData: () => {
          fetchData(0, 10);
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
      <NewListView
        properties={[]}
        data={list}
        beforeColumns={[
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
              return <div className="list-card-columns">{item.employeeId}</div>;
            },
          },
          {
            header: 'Email ID',
            template: function renderComp(item: User) {
              return <div className="list-card-columns">{item.email}</div>;
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FiberManualRecord
                            className="icon"
                            style={{ color: '#f7b500' }}
                          />
                          Unregistered
                        </div>
                      );
                    } else if (item.blocked) {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    if (!item.verified) {
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
                            onClick={() => onCancelInvite(item.id)}
                            style={{ color: '#ff6b6b', marginLeft: '12px' }}
                          >
                            Cancel Invite
                          </span>
                        </>
                      );
                    } else if (item.blocked) {
                      return (
                        <span
                          className="list-title"
                          onClick={() => onUnlockUser(item)}
                        >
                          Unblock
                        </span>
                      );
                    } else if (!item.archived) {
                      return (
                        <span
                          className="list-title"
                          onClick={() => onArchiveUser(item)}
                        >
                          Archive
                        </span>
                      );
                    } else if (item.archived) {
                      return (
                        <span
                          className="list-title"
                          onClick={() => onUnArchiveUser(item)}
                        >
                          Unarchive
                        </span>
                      );
                    }
                  })()}
                </div>
              );
            },
          },
        ]}
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
        {Array.from(
          { length: Math.min(pageable.totalPages, 10) },
          (_, i) => i,
        ).map((el) => (
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

export default NewTabContent;
