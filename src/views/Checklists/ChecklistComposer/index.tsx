// alias imports
import { AppDispatch, useTypedSelector } from '#store';

// library imports
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '../../../components';
import { useTypedSelector } from '../../../store/helpers';
import { AppDispatch } from '../../../store/types';
import { fetchChecklist } from './actions';
import Checklist from './Checklist';
import { ChecklistComposerProps, ChecklistState, TemplateMode } from './types';

const ChecklistComposer: FC<ChecklistComposerProps> = ({
  checklistId,
  checklistState,
  templateMode,
}) => {
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
