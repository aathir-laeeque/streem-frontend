import { ListViewComponent } from '#components';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import { Settings } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Checklist } from '../types';
import { fetchChecklists } from './actions';
import SideBar from './SideBar';
import { Composer } from './styles';
import { ListViewProps, ListViewState } from './types';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const {
    checklists,
    pageable,
    loading,
  }: Partial<ListViewState> = useTypedSelector(
    (state) => state.checklistListView,
  );
  const { checklist, job } = useTypedSelector((state) => state.properties);

  const dispatch = useDispatch();

  const selectChecklist = (id: string | number) =>
    navigate(`/checklists/${id}`);

  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null,
  );
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const fetchData = (page: number, size: number) => {
    dispatch(fetchChecklists({ page, size }));
  };

  useEffect(() => {
    fetchData(0, 10);

    if (!job?.length) {
      dispatch(fetchProperties({ type: 'job' }));
    }
    if (!checklist?.length) {
      dispatch(fetchProperties({ type: 'checklist' }));
    }
  }, []);

  const openNav = () => {
    const sideNav = document.getElementById('sideNav');
    if (sideNav && !sideBarOpen) {
      setSideBarOpen(true);
      sideNav.style.cssText = 'right: 0px;';
    }
  };

  const closeNav = () => {
    const sideNav = document.getElementById('sideNav');
    if (sideNav && sideBarOpen) {
      setSideBarOpen(false);
      sideNav.style.cssText = 'right: -300px;';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklists && job && checklist && pageable) {
    return (
      <Composer>
        <ListViewComponent
          properties={checklist}
          fetchData={fetchData}
          isLast={pageable.last}
          currentPage={pageable.page}
          data={checklists}
          nameItemHeader="NAME"
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
                onClick={() => {
                  setSelectedChecklist(item);
                  openNav();
                }}
              />
              <div className="title-group">
                <span className="list-code">{item.code}</span>
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
        <SideBar
          sideBarOpen={sideBarOpen}
          selectedChecklist={selectedChecklist}
          closeNav={closeNav}
          properties={job}
        />
      </Composer>
    );
  } else {
    return null;
  }
};

export default ListView;
