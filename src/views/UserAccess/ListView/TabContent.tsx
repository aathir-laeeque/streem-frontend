import React, { FC, useEffect } from 'react';
import { ListViewComponent } from '#components';
import { ReportProblemOutlined, ErrorOutline } from '@material-ui/icons';
import { User, UserState, UsersState, ParsedUser } from '#store/users/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { capitalize, startCase, toLower } from 'lodash';
import { Properties } from '#store/properties/types';
import {
  fetchUsers,
  setSelectedState,
  setSelectedUser,
} from '#store/users/actions';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';
import checkPermission from '#services/uiPermissions';
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
  selectedState,
}) => {
  const { loading, [selectedState]: users }: UsersState = useTypedSelector(
    (state) => state.users,
  );
  const { isIdle } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      fetchData(0, 10);
      dispatch(setSelectedState(selectedState));
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
          values: [selectedState === UserState.ARCHIVED],
        },
      ],
    });
    dispatch(
      fetchUsers(
        { page, size, filters, sort: 'createdAt,desc' },
        selectedState,
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
                  item.roles
                    .map((r) => ' ' + startCase(toLower(r.name)))
                    .join(),
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

  const afterColumns = checkPermission(['usersAndAccess', 'listViewActions'])
    ? [
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
                {selectedState === UserState.ACTIVE ? (
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
      ]
    : undefined;

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
          checkPermission(['usersAndAccess', 'addNewUser'])
            ? selectedState === UserState.ARCHIVED
              ? undefined
              : 'Add a New User'
            : undefined
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
                      <span className="list-state">
                        <span className="list-state-span">
                          <ReportProblemOutlined className="icon" />
                          Unregistered
                        </span>
                      </span>
                    )}
                    {item.blocked && (
                      <span className="list-state" style={{ color: '#ff6b6b' }}>
                        <span className="list-state-span">
                          <ErrorOutline className="icon" />
                          Account Locked
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            },
          },
        ]}
        afterColumns={afterColumns}
      />
    </Composer>
  );
};

export default TabContent;
