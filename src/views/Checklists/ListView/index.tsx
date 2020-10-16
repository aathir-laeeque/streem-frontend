import { ListViewComponent } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import { Settings } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FormMode } from '../NewPrototype/types';
import { Checklist } from '../types';
import { fetchChecklists } from './actions';
import SideBar from './SideBar';
import { Composer } from './styles';
import { ListViewProps, ListViewState } from './types';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { checklists, pageable, loading }: ListViewState = useTypedSelector(
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
    dispatch(fetchChecklists({ page, size, sort: 'createdAt,desc' }));
  };

  useEffect(() => {
    fetchData(0, 10);

    if (!job?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.JOB }));
    }
    if (!checklist?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.CHECKLIST }));
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
  }

  return (
    <Composer>
      <ListViewComponent
        properties={checklist}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={checklists}
        primaryButtonText="Create Checklist"
        onPrimaryClick={() =>
          navigate('prototype', { state: { mode: FormMode.ADD } })
        }
        beforeColumns={[
          {
            header: 'NAME',
            template: function renderComp(item: Checklist) {
              return (
                <div className="list-card-columns" key={`name_${item.code}`}>
                  <div className="title-group">
                    <span className="list-code">{item.code}</span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Settings
                        style={{
                          fontSize: '20px',
                          color: '#1d84ff',
                          width: '36px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setSelectedChecklist(item);
                          openNav();
                        }}
                      />
                      <span
                        className="list-title"
                        onClick={() => selectChecklist(item.id)}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            },
          },
        ]}
      />
      <SideBar
        sideBarOpen={sideBarOpen}
        selectedChecklist={selectedChecklist}
        closeNav={closeNav}
        properties={job}
      />
    </Composer>
  );
};

export default ListView;
