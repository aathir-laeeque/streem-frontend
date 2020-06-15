// alias imports
import { AppDispatch, useTypedSelector } from '#store';

// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Settings, ArrowDropDown, Search } from '@material-ui/icons';
import { FlatButton, Button1 } from '../../../components';
import { Checklist } from '../types';
import { fetchChecklists } from './action';
import { ListViewProps } from './types';
import { Composer } from './styles';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { checklists, properties, pageable, loading } = useTypedSelector(
    (state) => state.checklistListView,
  );

  const dispatch: AppDispatch = useDispatch();

  const selectChecklist = (id: string | number) =>
    navigate(`/checklists/${id}`);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (!checklists?.length) {
      dispatch(fetchChecklists({ page, size }));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklists && properties && pageable) {
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
          <Button1>Create Checklist</Button1>
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
          {(checklists as Array<Checklist>).map((el, index) => (
            <div key={index} className="checklist-card">
              <div className="checklist-card-columns">
                <Settings
                  style={{
                    fontSize: 20,
                    color: '#12aab3',
                    width: 40,
                    cursor: 'pointer',
                  }}
                  onClick={() => selectChecklist(el.id)}
                />
                <div className="title-group">
                  <span className="checklist-code">{el.code}</span>
                  <span
                    className="checklist-title"
                    onClick={() => selectChecklist(el.id)}
                  >
                    {el.name}
                  </span>
                </div>
              </div>
              {(properties as Array<string | null>).map((property, index) => (
                <div key={index} className="checklist-card-columns">
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
