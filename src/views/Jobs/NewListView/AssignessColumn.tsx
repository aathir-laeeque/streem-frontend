import { Avatar, AvatarExtras } from '#components/shared/Avatar';
import React, { FC } from 'react';
import styled from 'styled-components';

import { User } from '../../../services/users/types';
import { Assignee } from './types';

const Wrapper = styled.div.attrs({
  className: 'list-card-columns',
})`
  display: flex;

  .avatar {
    margin-right: -5px;
  }
`;

type Props = {
  assignees: Assignee[] | User[];
};

const AssigneesColumn: FC<Props> = ({ assignees = [] }) => {
  return (
    <Wrapper>
      {assignees.slice(0, 3).map((assignee) => (
        <Avatar
          user={assignee}
          key={assignee.id}
          color="blue"
          borderColor="#fff"
          backgroundColor="#eee"
        />
      ))}
      {assignees.length > 3 && (
        <AvatarExtras
          users={assignees.slice(3)}
          key={`assignee_length`}
          color="blue"
          borderColor="#fff"
          backgroundColor="#eee"
        />
      )}
    </Wrapper>
  );
};

export default AssigneesColumn;
