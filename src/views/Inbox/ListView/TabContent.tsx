import { ListViewComponent, ProgressBar } from '#components';
import { useTypedSelector } from '#store';
import JobCard from '#views/Jobs/Compoents/JobCard';
import { Job } from '#views/Jobs/types';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchInbox, setSelectedStatus } from './actions';
import { Composer } from './styles';
import { ListViewState, TabViewProps } from './types';

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { profile } = useTypedSelector((state) => state.auth);
  const { jobs, loading }: Partial<ListViewState> = useTypedSelector(
    (state) => state.inboxListView,
  );
  const reduerLabel = label.toLowerCase().split(' ').join('');

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(0, 10);
    dispatch(setSelectedStatus(reduerLabel));
  }, []);

  const selectJob = (item: Job) =>
    navigate(`/jobs/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'assignees',
          op: 'EQ',
          values: [profile?.id],
        },
      ],
    });
    dispatch(fetchInbox({ page, size, filters, sort: 'id,desc' }, reduerLabel));
  };

  const beforeColumns = [
    {
      header: 'JOB',
      template: function renderComp(item: Job) {
        return <JobCard item={item} onClick={selectJob} />;
      },
    },
    {
      header: 'TASKS COMPLETED',
      template: function renderComp(item: Job) {
        const percentage = (item.completedTasks * 100) / item.totalTasks;
        return (
          <div
            className="list-card-columns"
            key={`task_completed_${item.code}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flex: 0.8 }}>
              <ProgressBar
                bgColor="#dadada"
                percentage={percentage || 0}
                height={4}
              />
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

  if (job === undefined || loading) {
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
