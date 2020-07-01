// alias imports
import { AppDispatch, useTypedSelector } from '#store';
import { propsTransformer } from '#utils/propsTransformer';
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
  console.log('checklistId :: ', checklistId);
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

export default propsTransformer(
  (p) => ({
    ...p,
    ...(p?.location?.state?.checklistId && {
      checklistId: p.location.state.checklistId,
    }),
  }),
  ChecklistComposer,
);
