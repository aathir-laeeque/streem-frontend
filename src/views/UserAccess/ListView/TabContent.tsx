import React, { FC, useEffect } from 'react';
import { ListViewComponent } from '#components';
import WarningIcon from '@material-ui/icons/Warning';
import { User, UserStatus, UsersState, ParsedUser } from '#store/users/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { capitalize } from 'lodash';
import { Properties } from '#store/properties/types';
import {
  fetchUsers,
  setSelectedStatus,
  setSelectedUser,
} from '#store/users/actions';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';

import {
  resendInvite,
  archiveUser,
  unArchiveUser,
  unLockUser,
  cancelInvite,
} from '../actions';

import { useDispatch } from 'react-redux';
import { Composer } from './styles';
import { TabViewProps } from './types';
import { removeUnderscore } from '#utils/stringUtils';

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

const TabContent: FC<TabViewProps> = ({
  navigate = navigateTo,
  selectedStatus,
}) => {
  const { loading, [selectedStatus]: users }: UsersState = useTypedSelector(
    (state) => state.users,
  );
  const { isIdle } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      fetchData(0, 10);
      dispatch(setSelectedStatus(selectedStatus));
    }
  }, [isIdle]);

  const selectUser = (item: User) => {
    dispatch(setSelectedUser(item));
    navigate(`/user-access/edit-user`);
  };

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'archived',
          op: 'EQ',
          values: [selectedStatus === UserStatus.ARCHIVED],
        },
      ],
    });
    dispatch(
      fetchUsers(
        { page, size, filters, sort: 'createdAt,desc' },
        selectedStatus,
      ),
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const parsedUsers = (users.list as Array<User>).reduce<ParsedUser[]>(
    (result, item) => {
      if (item.id !== '0') {
        result.push({
          ...item,
          properties: {
            'EMAIL ID': item.email,
            ROLE: item.roles
              ? removeUnderscore(
                  item.roles.map((r) => ' ' + capitalize(r.name)).join(),
                )
              : '-N/A-',
          },
        });
      }
      return result;
    },
    [],
  );

  const properties: Properties =
    parsedUsers.length > 0
      ? Object.keys(parsedUsers[0].properties).map((pro, index) => {
          return {
            id: index,
            name: pro,
            placeHolder: pro,
            orderTree: index,
            mandatory: true,
          };
        })
      : [];

  return (
    <Composer>
      <ListViewComponent
        properties={properties}
        fetchData={fetchData}
        isLast={users.pageable.last}
        currentPage={users.pageable.page}
        data={parsedUsers}
        onPrimaryClick={() => navigate('user-access/add-user')}
        primaryButtonText={
          selectedStatus === UserStatus.ARCHIVED ? undefined : 'Add a New User'
        }
        beforeColumns={[
          {
            header: 'EMPLOYEE',
            template: function renderComp(item: User) {
              return (
                <div className="list-card-columns" key={`name_${item.id}`}>
                  <div
                    className="title-group"
                    style={{ paddingLeft: `16px`, marginTop: 0 }}
                  >
                    <span className="list-code">{item.employeeId}</span>
                    <span
                      className="list-title"
                      onClick={() => selectUser(item)}
                    >
                      {capitalize(item.firstName)} {capitalize(item.lastName)}
                    </span>
                    {!item.verified && !item.archived && (
                      <span className="list-status">
                        <span className="list-status-span">
                          <WarningIcon className="icon" />
                          Unregistered
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            },
          },
        ]}
        afterColumns={[
          {
            header: 'ACTIONS',
            template: function renderComp(item: User) {
              return (
                <div className="list-card-columns" key={`actions_${item.id}`}>
                  {item.blocked && (
                    <>
                      <span
                        className="user-actions"
                        onClick={() => onUnlockUser(item)}
                      >
                        Unlock
                      </span>
                      <span
                        className="user-actions"
                        style={{ color: '#666666', padding: '0 8px' }}
                      >
                        •
                      </span>
                    </>
                  )}
                  {selectedStatus === UserStatus.ACTIVE ? (
                    (item.verified && (
                      <span
                        className="user-actions"
                        onClick={() => onArchiveUser(item)}
                      >
                        Archive
                      </span>
                    )) || (
                      <>
                        <span
                          className="user-actions"
                          style={{ color: '#1d84ff' }}
                          onClick={() => onResendInvite(item.id)}
                        >
                          Resend Invite
                        </span>
                        <span
                          className="user-actions"
                          style={{ color: '#666666', padding: '0 8px' }}
                        >
                          •
                        </span>
                        <span
                          className="user-actions"
                          style={{ color: '#ff6b6b' }}
                          onClick={() => onCancelInvite(item.id)}
                        >
                          Cancel Invite
                        </span>
                      </>
                    )
                  ) : (
                    <span
                      className="user-actions"
                      onClick={() => onUnArchiveUser(item)}
                    >
                      Unarchive
                    </span>
                  )}
                </div>
              );
            },
          },
        ]}
      />
    </Composer>
  );
};

export default TabContent;
