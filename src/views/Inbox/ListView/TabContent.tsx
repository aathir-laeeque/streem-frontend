import { ListViewComponent, ProgressBar } from '#components';
import { useTypedSelector } from '#store';
import JobCard from '#views/Jobs/Compoents/JobCard';
import { Job } from '#views/Jobs/types';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchInbox, setSelectedState } from './actions';
import { Composer } from './styles';
import { ListViewState, TabViewProps } from './types';

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

  const selectJob = (item: Job) =>
    navigate(`/inbox/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const fetchData = (page: number, size: number) => {
    dispatch(fetchInbox({ page, size, sort: 'id,desc' }, reduerLabel));
  };

  const beforeColumns = [
    {
      header: 'JOB',
      template: function renderComp(item: Job) {
        return (
          <JobCard
            key={`job_card_${item.id}`}
            item={item}
            onClick={selectJob}
          />
        );
      },
    },
    {
      header: 'TASKS COMPLETED',
      template: function renderComp(item: Job) {
        const percentage = (item.completedTasks * 100) / item.totalTasks;
        return (
          <div
            className="list-card-columns"
            key={`task_completed_${item.id}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flex: 0.8 }}>
              <ProgressBar percentage={percentage || 0} height={4} />
            </div>
            <span
              style={{
                marginLeft: 8,
                color: '#666666',
                fontSize: 14,
              }}
            >
              {item.completedTasks}/{item.totalTasks}
            </span>
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
      <ListViewComponent
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
