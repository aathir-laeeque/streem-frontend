import { Avatar } from '#components/shared/Avatar';
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
      {assignees.slice(0, 4).map((assignee) => (
        <Avatar user={assignee} key={assignee.id} />
      ))}
    </Wrapper>
  );
};

export default AssigneesColumn;
