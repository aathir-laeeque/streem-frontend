import { ListViewComponent } from '#components';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { useTypedSelector } from '#store';
import { getInitials } from '#utils/stringUtils';
import { PersonAdd } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Job } from '../types';
import { fetchJobs, setSelectedStatus } from './actions';
import { Composer } from './styles';
import { JobStatus, ListViewState, TabViewProps } from './types';

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { jobs, loading }: Partial<ListViewState> = useTypedSelector(
    (state) => state.jobListView,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(0, 10);
    dispatch(setSelectedStatus(label));
  }, []);

  const selectJob = (item: Job) =>
    navigate(`/jobs/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [{ field: 'status', op: 'EQ', values: [label.toUpperCase()] }],
    });
    dispatch(fetchJobs({ page, size, filters, sort: 'id,desc' }, label));
  };

  const onClickAssign = (item: Job, index: number) => {
    dispatch(
      openModalAction({
        type: ModalNames.JOB_USER_ASSIGN,
        props: {
          selectedJobIndex: index,
          refreshData: () => fetchData(0, 10),
        },
      }),
    );
  };

  let beforeColumns = [
    {
      header: 'JOB',
      template: function renderComp(item: Job) {
        return (
          <div className="list-card-columns" key={`name_${item.code}`}>
            <div
              className="title-group"
              style={{ paddingLeft: `40px`, marginTop: 0 }}
            >
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
      header: 'ASSIGNEE',
      template: function renderComp(item: Job, index: number) {
        if (label === JobStatus.UNASSIGNED)
          return (
            <div className="list-card-columns" key={`assignee_${item.code}`}>
              <span
                className="list-title"
                onClick={() => {
                  onClickAssign(item, index);
                }}
                style={{ cursor: 'pointer', marginLeft: '15px' }}
              >
                <PersonAdd />
              </span>
            </div>
          );
        if (item.users?.length)
          return (
            <div
              key={`assignee_${item.code}`}
              className="list-card-columns"
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'flex-end',
              }}
              onClick={() => {
                onClickAssign(item, index);
              }}
            >
              {item.users.length > 4 && (
                <span key={`assignee_length`} className="user-thumb">
                  +{item.users.length - 4}
                </span>
              )}
              {item.users.slice(0, 4).map((user) => (
                <span key={`assignee_${user.id}`} className="user-thumb">
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </span>
              ))}
            </div>
          );
        return <div className="list-card-columns" />;
      },
    },
  ];
  if (label === JobStatus.ASSIGNED) {
    beforeColumns = [
      ...beforeColumns,
      {
        header: 'STATUS',
        template: function renderComp(item: Job) {
          return (
            <div className="list-card-columns" key={`status_${item.code}`}>
              <span>{item.status}</span>
            </div>
          );
        },
      },
      {
        header: 'TASK COMPLETED',
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
  }

  if (job === undefined || loading) {
    return <div>Loading...</div>;
  }

  return (
    <Composer>
      <div style={{ height: `calc(100% - 30px)` }}>
        <ListViewComponent
          properties={job}
          fetchData={fetchData}
          isLast={jobs[label].pageable.last}
          currentPage={jobs[label].pageable.page}
          data={jobs[label].list}
          primaryButtonText="Create Task"
          beforeColumns={beforeColumns}
        />
      </div>
    </Composer>
  );
};

export default TabContent;
