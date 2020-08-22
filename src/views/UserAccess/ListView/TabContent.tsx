import React, { FC, useEffect } from 'react';
import { ListViewComponent } from '#components';
import { User, UserStatus, UsersState } from '#store/users/types';
import { capitalize } from 'lodash';
import { Properties } from '#store/properties/types';
import {
  fetchUsers,
  setSelectedStatus,
  setSelectedUser,
} from '#store/users/actions';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';

import { resendInvite } from '../actions';

import { useDispatch } from 'react-redux';
import { Composer } from './styles';
import { TabViewProps } from './types';

const TabContent: FC<TabViewProps> = ({
  navigate = navigateTo,
  selectedStatus,
}) => {
  console.log('selectedStatus', selectedStatus);
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

  // const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    console.log('filters', filters);
    dispatch(fetchUsers({ page, size, filters }, selectedStatus));
  };

  const onResendInvite = (email: string) => {
    dispatch(resendInvite({ email, fetchData }));
  };

  const onCancelInvite = (email: string) => {
    console.log('onCancelInvite :', email);
  };

  const onArchiveUser = (email: string) => {
    console.log('onArchiveUser :', email);
  };

  const onUnArchiveUser = (email: string) => {
    console.log('onUnArchiveUser :', email);
  };

  if (loading || users[selectedStatus].list.length === 0) {
    return <div>Loading...</div>;
  }

  const parsedUsers = (users[selectedStatus].list as Array<User>).map(
    (item) => {
      let role;
      if (item.roles && item.roles[0])
        role = { ROLE: item.roles[0].name || 'System Admin' };
      return {
        ...item,
        properties: {
          'EMAIL ID': item.email,
          ...role,
          'LAST ACTIVE': '12 May 2020',
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
                    style={{ paddingLeft: `40px`, marginTop: 0 }}
                  >
                    <span className="list-code">{item.employeeId}</span>
                    <span
                      className="list-title"
                      onClick={() => selectUser(item)}
                    >
                      {capitalize(item.firstName)} {capitalize(item.lastName)}
                    </span>
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
                        onClick={() => onArchiveUser(item.email)}
                      >
                        Archive
                      </span>
                    )) || (
                      <>
                        <span
                          className="user-actions"
                          style={{ color: '#1d84ff' }}
                          onClick={() => onResendInvite(item.email)}
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
                          onClick={() => onCancelInvite(item.email)}
                        >
                          Cancel Invite
                        </span>
                      </>
                    )
                  ) : (
                    <span
                      className="user-actions"
                      onClick={() => onUnArchiveUser(item.email)}
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
