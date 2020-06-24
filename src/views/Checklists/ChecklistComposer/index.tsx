// alias imports
import { AppDispatch, useTypedSelector } from '#store';

// library imports
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// relative imports
import { fetchChecklist } from './actions';
import Checklist from './Checklist';
import { ChecklistComposerProps } from './types';

const ChecklistComposer: FC<ChecklistComposerProps> = ({ checklistId }) => {
  const dispatch: AppDispatch = useDispatch();

  const { activeChecklist, loading } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  useEffect(() => {
    if (!!checklistId && activeChecklist?.id !== parseInt(checklistId)) {
      dispatch(fetchChecklist(parseInt(checklistId)));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (activeChecklist) {
    return <Checklist />;
  } else {
    return null;
  }
};

export default ChecklistComposer;
