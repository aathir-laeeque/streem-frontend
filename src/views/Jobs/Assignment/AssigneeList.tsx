import { Avatar, AvatarExtras } from '#components';
import { User } from '#services/users/types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'assignments',
})`
  display: flex;
  margin-left: 16px;

  > .avatar:nth-child(1n) {
    margin-right: -5px;
  }
`;

type Props = {
  users: User[];
  count?: number;
};

const AssigneeList = ({ users, count = 4 }: Props) => (
  <Wrapper>
    {users.slice(0, count).map((user) => (
      <Avatar
        user={user}
        key={user.id}
        color="blue"
        borderColor="#ffffff"
        backgroundColor="#eeeeee"
      />
    ))}

    {users.length > count ? (
      <AvatarExtras
        users={users.slice(count)}
        color="blue"
        borderColor="#ffffff"
        backgroundColor="#eeeeee"
      />
    ) : null}
  </Wrapper>
);

export default AssigneeList;
