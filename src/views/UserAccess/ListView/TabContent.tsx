import React, { FC, useEffect } from 'react';
import { ListViewComponent } from '#components';
import WarningIcon from '@material-ui/icons/Warning';
import { User, UserStatus, UsersState } from '#store/users/types';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { capitalize } from 'lodash';
import { Properties } from '#store/properties/types';
import {
  fetchUsers,
  setSelectedStatus,
  setSelectedUser,
} from '#store/users/actions';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';

import { resendInvite, archiveUser, unArchiveUser } from '../actions';

import { useDispatch } from 'react-redux';
import { Composer } from './styles';
import { TabViewProps } from './types';

const TabContent: FC<TabViewProps> = ({
  navigate = navigateTo,
  selectedStatus,
}) => {
  const { users, loading }: Partial<UsersState> = useTypedSelector(
    (state) => state.users,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(0, 10);
    dispatch(setSelectedStatus(selectedStatus));
  }, []);

  const selectUser = (item: User) => {
    dispatch(setSelectedUser(item));
    navigate(`/user-access/view-user`);
  };

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'isArchived',
          op: 'EQ',
          values: [selectedStatus === UserStatus.ARCHIVED],
        },
      ],
    });
    dispatch(fetchUsers({ page, size, filters }, selectedStatus));
  };

  const onResendInvite = (id: string | number) => {
    dispatch(resendInvite({ id }));
  };

  const onCancelInvite = (id: string | number) => {
    console.log('onCancelInvite :', id);
  };

  const onArchiveUser = (user: User) => {
    dispatch(
      openModalAction({
        type: ModalNames.CONFIRMATION_MODAL,
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
          body: (
            <div className="body-content">
              You’re about to archive
              <span
                style={{ fontWeight: 'bold' }}
              >{` ${user.firstName} ${user.lastName}`}</span>
              .
            </div>
          ),
        },
      }),
    );
  };

  const onUnArchiveUser = (user: User) => {
    dispatch(
      openModalAction({
        type: ModalNames.CONFIRMATION_MODAL,
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
          body: (
            <div className="body-content">
              You’re about to unarchive
              <span
                style={{ fontWeight: 'bold' }}
              >{` ${user.firstName} ${user.lastName}`}</span>
              .
            </div>
          ),
        },
      }),
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (users[selectedStatus].list.length === 0) {
    return <div />;
  }

  const parsedUsers = (users[selectedStatus].list as Array<User>).map(
    (item) => {
      let role = { ROLE: '-N/A-' };
      if (item.roles && item.roles[0])
        role = {
          ROLE:
            capitalize(item.roles[0].name.replace('_', ' ')) || 'System Admin',
        };
      return {
        ...item,
        properties: {
          'EMAIL ID': item.email,
          ...role,
          // 'LAST ACTIVE': '12 May 2020',
        },
      };
    },
  );

  const properties: Properties = [];

  Object.keys(parsedUsers[0].properties).forEach((pro, index) => {
    properties.push({
      id: index,
      name: pro,
      placeHolder: pro,
      orderTree: index,
      mandatory: true,
    });
  });

  return (
    <Composer>
      <ListViewComponent
        properties={properties}
        fetchData={fetchData}
        isLast={users[selectedStatus].pageable.last}
        currentPage={users[selectedStatus].pageable.page}
        data={parsedUsers}
        onPrimaryClick={() => navigate('user-access/add-user')}
        primaryButtonText="Add a New User"
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
