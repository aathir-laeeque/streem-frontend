import { ListViewComponent, ProgressBar } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { createJob } from '#views/Jobs/ListView/actions';
// import { getInitials } from '#utils/stringUtils';
import JobCard from '#views/Jobs/Compoents/JobCard';
import { Job } from '#views/Jobs/types';
// import { PersonAdd } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchJobs, setSelectedStatus } from './actions';
import { Composer } from './styles';
import { JobStatus, ListViewState, TabViewProps } from './types';

// TODO :: CLean Comments if Assignee not required.

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { isIdle } = useTypedSelector((state) => state.auth);
  const { jobs, loading }: Partial<ListViewState> = useTypedSelector(
    (state) => state.jobListView,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      fetchData(0, 10);
      dispatch(setSelectedStatus(label));
    }
  }, [isIdle]);

  const selectJob = (item: Job) =>
    navigate(`/jobs/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'status',
          op: label === 'assigned' || 'completed' ? 'ANY' : 'EQ',
          values: [
            label.toUpperCase(),
            label === 'assigned' ? 'INPROGRESS' : '',
            label === 'completed' ? 'COMPLETED_WITH_EXCEPTION' : '',
          ],
        },
      ],
    });
    dispatch(fetchJobs({ page, size, filters, sort: 'id,desc' }, label));
  };

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: number; value: string }[] = [];
    const selectedId = jobDetails.checklistId;
    let error = false;
    if (!job) return false;
    job.every((property) => {
      if (property.name) {
        if (!jobDetails[property.name]) {
          if (property.mandatory) {
            error = true;
            return false;
          }
        } else {
          tempProperties.push({
            id: property.id,
            value: jobDetails[property.name],
          });
          return true;
        }
      }
    });
    if (!error && tempProperties && selectedId) {
      const parsedProperties: { id: number; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
          checklistId: parseInt(selectedId),
        }),
      );
    }
  };

  // const onClickAssign = (item: Job, index: number) => {
  //   dispatch(
  //     openOverlayAction({
  //       type: OverlayNames.JOB_USER_ASSIGN,
  //       props: {
  //         selectedJobIndex: index,
  //         refreshData: () => fetchData(0, 10),
  //       },
  //     }),
  //   );
  // };

  let beforeColumns = [
    {
      header: 'JOB',
      template: function renderComp(item: Job) {
        return (
          <JobCard item={item} onClick={selectJob} key={`job_${item.id}`} />
        );
      },
    },
    // {
    //   header: 'ASSIGNEE',
    //   template: function renderComp(item: Job, index: number) {
    //     if (label === JobStatus.UNASSIGNED)
    //       return (
    //         <div
    //           className="list-card-columns"
    //           key={`assignee_${item.id}`}
    //           style={{ justifyContent: 'flex-start' }}
    //         >
    //           <span
    //             className="list-title"
    //             onClick={() => {
    //               onClickAssign(item, index);
    //             }}
    //           >
    //             <PersonAdd style={{ marginLeft: 15 }} />
    //           </span>
    //         </div>
    //       );
    //     if (item.assignees?.length)
    //       return (
    //         <div
    //           key={`assignee_${item.id}`}
    //           className="list-card-columns"
    //           style={{
    //             flexDirection: 'row-reverse',
    //             justifyContent: 'flex-end',
    //           }}
    //           onClick={() => {
    //             onClickAssign(item, index);
    //           }}
    //         >
    //           {item.assignees.length > 4 && (
    //             <span key={`assignee_length`} className="user-thumb">
    //               +{item.assignees.length - 4}
    //             </span>
    //           )}
    //           {item.assignees.slice(0, 4).map((user) => (
    //             <span key={`assignee_${user.id}`} className="user-thumb">
    //               {getInitials(`${user.firstName} ${user.lastName}`)}
    //             </span>
    //           ))}
    //         </div>
    //       );
    //     return (
    //       <div className="list-card-columns" key={`assignee_${item.id}`} />
    //     );
    //   },
    // },
  ];
  if (label === JobStatus.ASSIGNED) {
    beforeColumns = [
      ...beforeColumns,
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
  }

  if (!job || loading) {
    return <div>Loading...</div>;
  }

  return (
    <Composer>
      <ListViewComponent
        properties={job}
        fetchData={fetchData}
        isLast={jobs[label].pageable.last}
        currentPage={jobs[label].pageable.page}
        data={jobs[label].list}
        primaryButtonText="Create a Job"
        beforeColumns={beforeColumns}
        onPrimaryClick={() => {
          dispatch(
            openOverlayAction({
              type: OverlayNames.CREATE_JOB_MODAL,
              props: {
                selectedChecklist: null,
                properties: job,
                onCreateJob: onCreateJob,
              },
            }),
          );
        }}
      />
    </Composer>
  );
};

export default TabContent;
