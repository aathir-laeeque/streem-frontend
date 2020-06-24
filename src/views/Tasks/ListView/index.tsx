// alias imports
import { AppDispatch, useTypedSelector } from '#store';
import { ListViewComponent } from '#components';
import { fetchProperties } from '#store/properties/actions';
// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchTasks } from './actions';
import { ListViewProps } from './types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { tasks, pageable, loading } = useTypedSelector(
    (state) => state.taskListView,
  );

  const { task } = useTypedSelector((state) => state.properties);

  const dispatch: AppDispatch = useDispatch();

  const selectTask = (id: string | number) => navigate(`/task/${id}`);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);

  useEffect(() => {
    if (!tasks?.length) {
      dispatch(fetchTasks({ page, size }));
    }
    if (!task?.length) {
      dispatch(fetchProperties({ type: 'task', sort: 'orderTree' }));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (task && tasks && pageable) {
    return (
      <Composer>
        <ListViewComponent
          properties={task}
          data={tasks}
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
      </Composer>
    );
  } else {
    return null;
  }
};

export default ListView;
