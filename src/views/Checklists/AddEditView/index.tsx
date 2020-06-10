import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../../../store/helpers';
import { AppDispatch } from '../../../store/types';
import { loadChecklists, setSelectedChecklist } from '../actions';
import HeaderView from './HeaderView';
import StageListView from './StageListView';
import StepsView from './StepsView';
import { Layout } from './styles';
import { AddEditViewProps } from './types';

const AddEditView: FC<AddEditViewProps> = ({ checklistId }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();

  const { loading, checklists, selectedChecklist } = useTypedSelector(
    (state) => state.checklist,
  );

  useEffect(() => {
    if (!checklists.length) {
      dispatch(loadChecklists());
    }
  }, []);

  useEffect(() => {
    if (
      (!selectedChecklist || selectedChecklist.id !== checklistId) &&
      checklists.length
    ) {
      dispatch(setSelectedChecklist(checklistId));
    }
  }, [checklists]);

  const { stages = [] } = selectedChecklist || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <HeaderView />
      <StageListView
        stages={stages}
        activeStage={activeStage}
        setActiveStage={(stageNumber) => setActiveStage(stageNumber)}
      />
      <StepsView stageNumber={activeStage + 1} />
    </Layout>
  );
};

export default AddEditView;
