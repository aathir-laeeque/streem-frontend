import { ListViewComponent, ProgressBar, NewListView } from '#components';
import { useTypedSelector } from '#store';
import JobCard from '#views/Jobs/Compoents/JobCard';
import { Job } from '#views/Jobs/types';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiberManualRecord } from '@material-ui/icons';

import { fetchInbox, setSelectedState } from './actions';
import { Composer } from './styles';
import { ListViewState, TabViewProps } from './types';
import {
  AssignedJobStates,
  CompletedJobStates,
} from '../../Jobs/NewListView/types';
import AssigneesColumn from '../../Jobs/NewListView/AssignessColumn';

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { jobs, loading }: ListViewState = useTypedSelector(
    (state) => state.inboxListView,
  );
  const { isIdle } = useTypedSelector((state) => state.auth);
  const reduerLabel = label.toLowerCase().split(' ').join('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      fetchData(0, 10);
      dispatch(setSelectedState(reduerLabel));
    }
  }, [isIdle]);

  const fetchData = (page: number, size: number) => {
    dispatch(fetchInbox({ page, size, sort: 'createdAt,desc' }, reduerLabel));
  };

  const beforeColumns = [
    {
      header: 'Name',
      template: function renderComp({
        id,
        checklist: { id: checklistId, name: checklistName },
      }: Job) {
        return (
          <div className="list-card-columns">
            <span
              className="list-title"
              onClick={() => {
                navigate(`/inbox/${id}`, { state: { checklistId } });
              }}
              style={{
                width: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {checklistName}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Job Status',
      template: function renderComp({ state }: Job) {
        const isJobStarted = state === AssignedJobStates.IN_PROGRESS;

        const isJobCompleted = state === CompletedJobStates.COMPLETED;

        const isCompletedWithException =
          state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

        return (
          <div className="list-card-columns">
            <FiberManualRecord
              className="icon"
              style={{
                color: isJobCompleted
                  ? '#5aa700'
                  : isJobStarted
                  ? '#1d84ff'
                  : '#f7b500',
              }}
            />
            <span
              style={{
                width: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {isJobCompleted
                ? 'Completed'
                : isCompletedWithException
                ? 'Completed with Exception'
                : isJobStarted
                ? 'Started'
                : 'Not Started'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Assignees',
      template: function renderComp(item: Job) {
        return <AssigneesColumn jobId={item.id} />;
      },
    },
    {
      header: 'Task Completed',
      template: function renderComp({ completedTasks, totalTasks }: Job) {
        const percentage = (completedTasks / totalTasks) * 100;
        return (
          <div className="list-card-columns task-progress">
            <ProgressBar whiteBackground percentage={percentage} />
            <span>
              {completedTasks} of {totalTasks} Tasks
            </span>
          </div>
        );
      },
    },
    {
      header: 'Job ID',
      template: function renderComp(item: Job) {
        return (
          <div className="list-card-columns" key={item.id}>
            {item.code}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Composer>
      <NewListView
        properties={job}
        fetchData={fetchData}
        isLast={jobs[reduerLabel].pageable.last}
        currentPage={jobs[reduerLabel].pageable.page}
        data={jobs[reduerLabel].list}
        beforeColumns={beforeColumns}
      />
    </Composer>
  );
};

export default TabContent;
