import { ListViewComponent } from '#components';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Job } from '../types';
import { fetchInbox, setSelectedStatus } from './actions';
import { Composer } from './styles';
import { ListViewState, TabViewProps, InboxStatus } from './types';

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
          field: 'assignee',
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
        return (
          <div className="list-card-columns" key={`name_${item.code}`}>
            <div className="title-group">
              <span className="list-code">{item.code}</span>
              <span className="list-title" onClick={() => selectJob(item)}>
                {item.checklist.name}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'TASKS COMPLETED',
      template: function renderComp(item: Job) {
        return (
          <div
            className="list-card-columns"
            key={`task_completed_${item.code}`}
          >
            <span
              style={{
                width: '70%',
                backgroundColor: '#dadada',
                height: '5px',
                borderRadius: '3px',
              }}
            >
              <div
                style={{
                  width: '60%',
                  backgroundColor: '#6bafb3',
                  height: '5px',
                }}
              />
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
