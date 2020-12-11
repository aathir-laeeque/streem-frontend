import { Avatar, AvatarExtras } from '#components/shared/Avatar';
import { apiGetAssignedUsersForJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Job } from './types';

const Wrapper = styled.div.attrs({
  className: 'list-card-columns',
})`
  display: flex;

  .avatar {
    margin-right: -5px;
  }
`;

type Props = {
  jobId: Job['id'];
};

const AssigneesColumn: FC<Props> = ({ jobId }) => {
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await request('GET', apiGetAssignedUsersForJob(jobId));

      if (data) {
        setAssignees(data);
      }
    })();
  }, []);

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
