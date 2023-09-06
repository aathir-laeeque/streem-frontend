import { LoadingContainer } from '#components';
import { useTypedSelector } from '#store';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import JobHeader from './components/Header';
import Task from './components/Task';
import TaskNavigation from './components/TaskNavigation';
import { jobActions } from './jobStore';

const JobWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  .job-body {
    display: flex;
    flex: 1;
    background-color: red;
    overflow: hidden;
  }
`;

const Job: FC = () => {
  return (
    <JobWrapper data-testid="job-wrapper">
      <JobHeader />
      <div className="job-body">
        <TaskNavigation />
        <Task />
      </div>
    </JobWrapper>
  );
};

const JobContainer: FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ id }) => {
  const dispatch = useDispatch();
  const { loading } = useTypedSelector((state) => state.job);
  useEffect(() => {
    if (id) {
      dispatch(jobActions.getJob({ id }));
      dispatch(jobActions.getAssignments({ id }));
    }
    return () => {
      dispatch(jobActions.reset());
    };
  }, []);

  return <LoadingContainer loading={loading} component={<Job />} />;
};

export default JobContainer;
