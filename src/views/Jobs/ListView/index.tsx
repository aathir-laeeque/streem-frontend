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

  const onAssignJob = () => {
    console.log('Job Assigned');
  };

  const onClickAssign = (item: Job) => {
    dispatch(
      openModalAction({
        type: ModalNames.JOB_USER_ASSIGN,
        props: {
          selectedJob: item,
          users: list,
          onAssignJob,
        },
      }),
    );
  };

  const pageable = jobs[selectedStatus].pageable;

  if (job && jobs[selectedStatus].list?.length && pageable) {
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
        {(loading && <div>Loading...</div>) || (
          <div style={{ height: `calc(100% - 30px)` }}>
            <ListViewComponent
              properties={job}
              fetchData={fetchData}
              isLast={pageable.last}
              currentPage={pageable.page}
              data={jobs[selectedStatus].list}
              primaryButtonText="Create Checklist"
              actionItemTemplate={(item: Job) => (
                <div className="list-card-columns">
                  <span
                    className="list-title"
                    onClick={() => {
                      onClickAssign(item);
                    }}
                    style={{ cursor: 'pointer', marginLeft: '15px' }}
                  >
                    <PersonAdd />
                  </span>
                </div>
              )}
              actionItemHeader="ASSIGNEE"
              nameItemHeader="JOB"
              nameItemTemplate={(item: Job) => (
                <div className="list-card-columns">
                  <div
                    className="title-group"
                    style={{ paddingLeft: `40px`, marginTop: 0 }}
                  >
                    <span className="list-code">{item.code}</span>
                    <span
                      className="list-title"
                      onClick={() => selectJob(item)}
                    >
                      {item.checklist.name}
                    </span>
                  </div>
                </div>
              )}
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
