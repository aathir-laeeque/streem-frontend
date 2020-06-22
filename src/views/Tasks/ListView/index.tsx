import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowDropDown, Search } from '@material-ui/icons';

import { useTypedSelector } from '../../../store/helpers';
import { AppDispatch } from '../../../store/types';
import { FlatButton, Button } from '../../../components';
import { Task } from '../types';
import { fetchTasks } from './action';
import { ListViewProps } from './types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { tasks, properties, pageable, loading } = useTypedSelector(
    (state) => state.taskListView,
  );

  const dispatch = useDispatch<AppDispatch>();

  const selectTask = (id: string | number) => navigate(`/task/${id}`);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (!tasks?.length) {
      dispatch(fetchTasks({ page, size }));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (tasks && properties && pageable) {
    return (
      <Composer>
        <div className="list-options">
          <FlatButton>
            Filters <ArrowDropDown style={{ fontSize: 20, color: '#12aab3' }} />
          </FlatButton>
          <div className="searchboxwrapper">
            <input className="searchbox" type="text" placeholder="Search" />
            <Search className="searchsubmit" />
          </div>
          <span className="resetOption">Reset</span>
          <Button style={{ marginLeft: `auto`, marginRight: 0 }}>
            Create Task
          </Button>
        </div>
        <div className="list-header">
          <div className="list-header-columns">
            <span style={{ marginLeft: 40 }}></span>NAME
          </div>
          {(properties as Array<string>).map((el, index) => (
            <div key={index} className="list-header-columns">
              {el}
            </div>
          ))}
        </div>
        <div className="list-body">
          {(tasks as Array<Task>).map((el, index) => (
            <div key={index} className="list-card">
              <div className="list-card-columns">
                <div className="title-group">
                  <span className="list-code">{el.code}</span>
                  <span
                    className="list-title"
                    onClick={() => selectTask(el.id)}
                  >
                    {el.name}
                  </span>
                </div>
              </div>
              {(properties as Array<string | null>).map((property, index) => (
                <div key={index} className="list-card-columns">
                  {el.properties && property && el.properties[property]
                    ? el.properties[property]
                    : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Composer>
    );
  } else {
    return null;
  }
};

export default ListView;
