import { ListViewComponent } from '#components';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import { fetchUsers } from '#store/users/actions';
import { PersonAdd } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getInitials } from '#utils/stringUtils';
import { Job } from '../types';
import { fetchJobs, setSelectedStatus } from './actions';
import { Composer } from './styles';
import { JobStatus, ListViewProps, ListViewState } from './types';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const {
    jobs,
    loading,
    selectedStatus,
  }: Partial<ListViewState> = useTypedSelector((state) => state.jobListView);
  const { job } = useTypedSelector((state) => state.properties);
  const { list } = useTypedSelector((state) => state.users);

  const dispatch = useDispatch();

  const selectJob = (item: Job) =>
    navigate(`/jobs/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [{ field: 'status', op: 'EQ', values: [selectedStatus] }],
    });
    dispatch(
      fetchJobs({ page, size, filters, sort: 'id,desc' }, selectedStatus),
    );
  };

  useEffect(() => {
    fetchData(0, 10);

    if (!job?.length) {
      dispatch(fetchProperties({ type: 'job', sort: 'orderTree' }));
    }

    if (!list?.length) {
      dispatch(fetchUsers({ sort: 'id' }));
    }
  }, [selectedStatus]);

  const setSelectedTab = (status: string) => {
    if (selectedStatus !== status) {
      dispatch(setSelectedStatus(status));
    }
  };

  const onClickAssign = (item: Job, index: number) => {
    dispatch(
      openModalAction({
        type: ModalNames.JOB_USER_ASSIGN,
        props: {
          selectedJobIndex: index,
          users: list,
        },
      }),
    );
  };

  if (job) {
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
          if (selectedStatus === JobStatus.UNASSIGNED)
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
          if (item.users?.length) {
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
          }
          return <div />;
        },
      },
    ];
    if (selectedStatus === JobStatus.ASSIGNED) {
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
    return (
      <Composer>
        <div className="tabs-row">
          <span
            className={
              selectedStatus === JobStatus.UNASSIGNED
                ? 'tab-title tab-active'
                : 'tab-title'
            }
            onClick={() => setSelectedTab(JobStatus.UNASSIGNED)}
          >
            Unassigned
          </span>
          <span
            className={
              selectedStatus === JobStatus.ASSIGNED
                ? 'tab-title tab-active'
                : 'tab-title'
            }
            onClick={() => setSelectedTab(JobStatus.ASSIGNED)}
          >
            Active
          </span>
        </div>
        {(loading &&
          !jobs[selectedStatus].list?.length &&
          !jobs[selectedStatus].pageable && <div>Loading...</div>) || (
          <div style={{ height: `calc(100% - 30px)` }}>
            <ListViewComponent
              properties={job}
              fetchData={fetchData}
              isLast={jobs[selectedStatus].pageable.last}
              currentPage={jobs[selectedStatus].pageable.page}
              data={jobs[selectedStatus].list}
              primaryButtonText="Create Task"
              beforeColumns={beforeColumns}
            />
          </div>
        )}
      </Composer>
    );
  } else {
    return null;
  }
};

export default ListView;
