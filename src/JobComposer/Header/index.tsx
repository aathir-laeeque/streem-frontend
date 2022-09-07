import { Avatar } from '#components';
import { useTypedSelector } from '#store';
import { Users } from '#store/users/types';
import { apiGetAllUsersAssignedToJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { usePrevious } from '#utils/usePrevious';
import {
  AssignedJobStates,
  CompletedJobStates,
  Job,
  JobStateEnum,
} from '#views/Jobs/ListView/types';
import { FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import JobHeaderButtons from './JobHeaderButtons';
import Wrapper from './styles';

const Header = () => {
  const [assignedUsers, setAssignedUsers] = useState<Users | undefined>(undefined);
  const [isLoggedInUserAssigned, setIsLoggedInUserAssigned] = useState(false);
  const {
    composer: { jobState, data },
    auth: { profile },
  } = useTypedSelector((state) => state);
  const { code: jobCode, id: jobId, checklist } = (data as Job) ?? {};
  const prevJobState = usePrevious(jobState);
  const getAssignments = async () => {
    if (jobId) {
      const response: { data: Users; errors: { message: string }[] } = await request(
        'GET',
        apiGetAllUsersAssignedToJob(jobId),
      );
      if (response.data) {
        setAssignedUsers(response.data);
        setIsLoggedInUserAssigned(response.data.some((user) => user.id === profile?.id));
      } else {
        console.error('error came in fetch assigned users from component :: ', response.errors);
      }
    }
  };

  useEffect(() => {
    getAssignments();
  }, [jobId]);

  useEffect(() => {
    if (prevJobState === JobStateEnum.UNASSIGNED && jobState === JobStateEnum.ASSIGNED)
      getAssignments();
  }, [jobState]);

  const isInboxView = location.pathname.split('/')[1] === 'inbox';
  const isJobBlocked = jobState === AssignedJobStates.BLOCKED;
  const isJobStarted = jobState === AssignedJobStates.IN_PROGRESS;
  const isJobCompleted = jobState === CompletedJobStates.COMPLETED;
  const isCompletedWithException = jobState === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

  const jobStateTitle = isJobCompleted
    ? 'Completed'
    : isCompletedWithException
    ? 'Completed with Exception'
    : isJobBlocked
    ? 'Approval Pending'
    : isJobStarted
    ? 'Started'
    : 'Not Started';

  return (
    <Wrapper>
      <div className="job-primary-header">
        <div>
          <div className="checklist-name">{checklist?.name}</div>
          <div className="job-state">
            <FiberManualRecord
              className="icon"
              style={{
                fontSize: '15px',
                color: isJobCompleted ? '#5aa700' : isJobStarted ? '#1d84ff' : '#f7b500',
              }}
            />
            <div>{jobStateTitle}</div>
          </div>
        </div>
        <JobHeaderButtons
          jobData={data}
          jobState={jobState}
          isInboxView={isInboxView}
          isLoggedInUserAssigned={isLoggedInUserAssigned}
          profile={profile}
        />
      </div>
      <div className="job-secondary-header">
        <div className="job-id">Job ID: {jobCode}</div>
        <div className="checklist-id">Checklist ID: {checklist?.code}</div>
        <div className="job-assignees">
          {assignedUsers &&
            assignedUsers?.map((author) => <Avatar user={author} key={author?.employeeId} />)}
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
