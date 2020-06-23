// alias imports
import { AppDispatch, useTypedSelector } from '#store';

// library imports
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// relative imports
import { fetchChecklist } from './actions';
import ChecklistForm from './ChecklistForm';
import { ChecklistComposerProps } from './types';

const ChecklistComposer: FC<ChecklistComposerProps> = ({ checklistId }) => {
  const { checklist, loading } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!!checklistId && checklist?.id !== parseInt(checklistId)) {
      dispatch(fetchChecklist(parseInt(checklistId)));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklist) {
    return <ChecklistForm checklist={checklist} />;
  } else {
    return null;
  }
};

export default ChecklistComposer;
