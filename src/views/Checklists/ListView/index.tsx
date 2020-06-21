// alias imports
import { AppDispatch, useTypedSelector } from '#store';

// library imports
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// relative imports
import { Checklist } from '../types';
import { fetchChecklists } from './action';
import { ListViewProps } from './types';

const ListView: FC<ListViewProps> = ({ navigate = navigateTo }) => {
  const { checklists, loading } = useTypedSelector(
    (state) => state.checklistListView,
  );

  const dispatch: AppDispatch = useDispatch();

  const selectChecklist = (id: string | number) => navigate(`/checklist/${id}`);

  useEffect(() => {
    if (!checklists?.length) {
      dispatch(fetchChecklists());
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklists) {
    return (
      <div>
        {(checklists as Array<Checklist>).map((el, index) => (
          <div key={index} onClick={() => selectChecklist(el.id)}>
            {el.name}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default ListView;
