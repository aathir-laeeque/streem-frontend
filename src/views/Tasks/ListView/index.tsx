// alias imports
import { useTypedSelector } from '#store';
import { ListViewComponent } from '#components';
import { fetchProperties } from '#store/properties/actions';
import { fetchUsers } from '#store/users/actions';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchTasks, setSelectedStatus } from './actions';
import { ListViewProps, TaskStatus } from './types';
import { Task } from '../types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { tasks, loading, selectedStatus } = useTypedSelector(
    (state) => state.taskListView,
  );
  const { task } = useTypedSelector((state) => state.properties);
  const { list } = useTypedSelector((state) => state.users);

  const dispatch = useDispatch();

  const selectTask = (item) =>
    navigate(`/tasks/${item.id}`, {
      state: { checklistId: item.checklist.id },
    });

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);

  useEffect(() => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [{ field: 'status', op: 'EQ', values: [selectedStatus] }],
    });

    dispatch(fetchTasks({ page, size, filters }, selectedStatus));

    if (!task?.length) {
      dispatch(fetchProperties({ type: 'task', sort: 'orderTree' }));
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

  const onAssignTask = () => {
    console.log('Task Assgined');
  };

  const onClickAssign = (item: Task) => {
    dispatch(
      openModalAction({
        type: ModalNames.TASK_USER_ASSIGN,
        props: {
          selectedTask: item,
          users: list,
          onAssignTask,
        },
      }),
    );
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
              actionItemTemplate={(item) => (
                <div className="list-card-columns">
                  <span
                    className="list-title"
                    onClick={() => {
                      onClickAssign(item);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Assign
                  </span>
                </div>
              )}
              nameItemTemplate={(item) => (
                <div className="list-card-columns">
                  <div
                    className="title-group"
                    style={{ paddingLeft: `40px`, marginTop: 0 }}
                  >
                    <span className="list-code">{item.code}</span>
                    <span
                      className="list-title"
                      onClick={() => selectTask(item)}
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
