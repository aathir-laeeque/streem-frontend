// alias imports
import { AppDispatch, useTypedSelector } from '#store';
import { ListViewComponent } from '#components';
import { fetchProperties } from '#store/properties/actions';
// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchTasks, setselectedStatus } from './actions';
import { ListViewProps, TaskStatus } from './types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { tasks, loading, selectedStatus } = useTypedSelector(
    (state) => state.taskListView,
  );

  const { task } = useTypedSelector((state) => state.properties);

  const dispatch: AppDispatch = useDispatch();

  const selectTask = (id: string | number) => navigate(`/tasks/${id}`);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);

  useEffect(() => {
    // if (!tasks[selectedStatus].list?.length) {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [{ field: 'status', op: 'EQ', values: [selectedStatus] }],
    });

    dispatch(fetchTasks({ page, size, filters }, selectedStatus));

    // }
    if (!task?.length) {
      dispatch(fetchProperties({ type: 'task', sort: 'orderTree' }));
    }
  }, [selectedStatus]);

  const setSelectedTab = (status: string) => {
    if (selectedStatus !== status) {
      dispatch(setselectedStatus(status));
    }
  };

  if (task && tasks[selectedStatus].list?.length) {
    return (
      <Composer>
        <div className="tabs-row">
          <span
            className={
              selectedStatus === TaskStatus.UNASSIGNED
                ? 'tab-title tab-active'
                : 'tab-title'
            }
            onClick={() => setSelectedTab(TaskStatus.UNASSIGNED)}
          >
            Unassigned
          </span>
          <span
            className={
              selectedStatus === TaskStatus.ASSIGNED
                ? 'tab-title tab-active'
                : 'tab-title'
            }
            onClick={() => setSelectedTab(TaskStatus.ASSIGNED)}
          >
            Active
          </span>
        </div>
        {(loading && <div>Loading...</div>) || (
          <div style={{ height: `calc(100% - 30px)` }}>
            <ListViewComponent
              properties={task}
              data={tasks[selectedStatus].list}
              primaryButtonText="Create Checklist"
              nameItemTemplate={(item) => (
                <div className="list-card-columns">
                  <div
                    className="title-group"
                    style={{ paddingLeft: `40px`, marginTop: 0 }}
                  >
                    <span className="list-code">{item.code}</span>
                    <span
                      className="list-title"
                      onClick={() => selectTask(item.id)}
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
