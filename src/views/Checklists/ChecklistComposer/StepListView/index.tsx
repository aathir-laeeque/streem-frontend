import { RootState } from '#store';

import React, { FC } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import StepsListForm from './StepsListForm';
import { StepsWrapper } from './styles';
import { StepListViewProps } from './types';

const StepListView: FC<StepListViewProps> = ({
  formStages,
  activeStageIndex,
  stages,
}) => (
  <StepsWrapper>
    <span className="stage-number">Stage {activeStageIndex + 1}</span>
    <span className="stage-name">{formStages[activeStageIndex].name}</span>

    <StepsListForm initialValues={{ steps: stages[activeStageIndex].steps }} />
  </StepsWrapper>
);

const stageFormSelector = formValueSelector('stageListForm');

const mapStateToProps = (state: RootState) => ({
  formStages: stageFormSelector(state, 'stages'),
  activeStageIndex: state.checklistComposer.activeStageIndex,
  stages: state.checklistComposer.stages,
});

const withConnect = connect(mapStateToProps, null);

export default withConnect(StepListView);
