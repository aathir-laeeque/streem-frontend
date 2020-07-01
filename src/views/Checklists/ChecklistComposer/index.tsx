// alias imports
import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchChecklist } from './actions';
import Checklist from './Checklist';
import { ChecklistComposerProps, ChecklistState, TemplateMode } from './types';

// library imports
const ChecklistComposer: FC<ChecklistComposerProps> = ({
  checklistId,
  checklistState,
  templateMode,
}) => {
  const dispatch = useDispatch();

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
    return (
      <Checklist checklistState={checklistState} templateMode={templateMode} />
    );
  } else {
    return null;
  }
};

ChecklistComposer.defaultProps = {
  checklistState: ChecklistState.ADD_EDIT,
  templateMode: TemplateMode.EDITABLE,
};

export default ChecklistComposer;
