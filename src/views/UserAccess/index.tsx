import React, { FC, useEffect, useState } from 'react';
import { ListViewComponent } from '#components';
import { User } from '#store/users/types';
import { Properties } from '#store/properties/types';
import { fetchUsers } from '#store/users/actions';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';

import { useDispatch } from 'react-redux';
import { Composer } from './styles';
import { UserAccessProps, UserAccessState } from './types';

const UserAccess: FC<UserAccessProps> = ({ navigate = navigateTo }) => {
  const { list, pageable }: Partial<UserAccessState> = useTypedSelector(
    (state) => state.users,
  );

  const dispatch = useDispatch();

  const selectUser = (id: string | number) => navigate(`/users/${id}`);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = (page: number, size: number) => {
    dispatch(fetchUsers({ page, size }));
  };

  useEffect(() => {
    fetchData(0, 10);
  }, []);

  if (list && pageable) {
    const users = list.map((item) => {
      return {
        ...item,
        properties: {
          ...item,
          'EMAIL ID': 'jerrell.ruecker@karianne.io',
          ROLE: 'System Admin',
          'LAST ACTIVE': '12 May 2020',
        },
      };
    });

    const properties = [];

    Object.keys(users[0].properties).forEach((pro, index) => {
      if (pro !== 'id' && pro !== 'firstName' && pro !== 'lastName') {
        properties.push({
          id: index,
          name: pro,
          placeHolder: pro,
          orderTree: index,
          mandatory: true,
        });
      }
    });

    // const properties: Properties = [
    //   {
    //     id: 4,
    //     name: 'EMAIL ID',
    //     placeHolder: 'Email id',
    //     orderTree: 1,
    //     mandatory: true,
    //   },
    //   {
    //     id: 5,
    //     name: 'ROLE',
    //     placeHolder: 'Email id',
    //     orderTree: 2,
    //     mandatory: true,
    //   },
    //   {
    //     id: 6,
    //     name: 'LAST ACTIVE',
    //     placeHolder: 'Email id',
    //     orderTree: 3,
    //     mandatory: true,
    //   },
    // ];

    return (
      <Composer>
        <ListViewComponent
          properties={properties}
          fetchData={fetchData}
          isLast={pageable.last}
          currentPage={pageable.page}
          data={users}
          primaryButtonText="Add User"
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
                      <span className="list-code">{item.id}</span>
                      <span
                        className="list-title"
                        // onClick={() => selectUser(item)}
                      >
                        {item.firstName} {item.lastName}
                      </span>
                    </div>
                  </div>
                );
              },
            },
          ]}
        />
      </Composer>
    );
  } else {
    return null;
  }
};

export default UserAccess;
