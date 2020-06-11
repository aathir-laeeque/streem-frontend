import { navigate as navigateTo, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../../../store/helpers';
import { AppDispatch } from '../../../store/types';
import { loadChecklists, setSelectedChecklist } from '../actions';

const ListView: FC<RouteComponentProps> = ({ navigate = navigateTo }) => {
  const { checklists = [], loading, error } = useTypedSelector(
    (state) => state.checklist,
  );

  const dispatch = useDispatch<AppDispatch>();

  const selectChecklist = (checklistId: string | number) => {
    dispatch(setSelectedChecklist(checklistId));
    navigate(`/checklist/${checklistId}`);
  };

  useEffect(() => {
    if (!checklists.length) {
      dispatch(loadChecklists());
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading checklists</div>;
  }

  return (
    <div>
      {checklists.map((checklist, index) => (
        <div
          key={index}
          style={{ padding: '10px', borderBottom: '1px solid #0000' }}
          onClick={() => selectChecklist(checklist.id)}
        >
          {checklist.name}
        </div>
      ))}
    </div>
  );
};

export default ListView;
