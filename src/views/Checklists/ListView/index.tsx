// alias imports
import { AppDispatch, useTypedSelector } from '#store';
import { ListViewComponent } from '#components';
import { fetchProperties } from '#store/properties/actions';
// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { Settings } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { Settings } from '@material-ui/icons';

import SideBar from './SideBar';
import { fetchChecklists } from './actions';
import { ListViewProps } from './types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { checklists, pageable, loading } = useTypedSelector(
    (state) => state.checklistListView,
  );
  const { checklist, task } = useTypedSelector((state) => state.properties);

  const dispatch: AppDispatch = useDispatch();

  const selectChecklist = (id: string | number) =>
    navigate(`/checklists/${id}`);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  useEffect(() => {
    if (!checklists?.length) {
      dispatch(fetchChecklists({ page, size }));
    }
    if (!task?.length) {
      dispatch(fetchProperties({ type: 'task' }));
    }
    if (!checklist?.length) {
      dispatch(fetchProperties({ type: 'checklist' }));
    }
  }, []);

  const openNav = () => {
    const mySidenav = document.getElementById('mySidenav');
    if (mySidenav && !sideBarOpen) {
      setSideBarOpen(true);
      mySidenav.style.cssText = 'right: 0px;';
    }
  };

  const closeNav = () => {
    const mySidenav = document.getElementById('mySidenav');
    if (mySidenav && sideBarOpen) {
      setSideBarOpen(false);
      mySidenav.style.cssText = 'right: -300px;';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklists && task && pageable) {
    return (
      <Composer>
        <ListViewComponent
          properties={checklist}
          data={checklists}
          primaryButtonText="Create Checklist"
          nameItemTemplate={(item) => (
            <div className="list-card-columns">
              <Settings
                style={{
                  fontSize: 20,
                  color: '#12aab3',
                  width: 40,
                  cursor: 'pointer',
                }}
                onClick={() => openNav()}
              />
              <div className="title-group">
                <span className="lsit-code">{item.code}</span>
                <span
                  className="list-title"
                  onClick={() => selectChecklist(item.id)}
                >
                  {item.name}
                </span>
              </div>
            </div>
          )}
        />
        <SideBar sideBarOpen={sideBarOpen} closeNav={closeNav} />
      </Composer>
    );
  } else {
    return null;
  }
};

export default ListView;
