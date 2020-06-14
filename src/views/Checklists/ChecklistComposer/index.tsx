import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '../../../components';
import { useTypedSelector } from '../../../store/helpers';
import { AppDispatch } from '../../../store/types';
import { fetchChecklist } from './actions';
import Stages from './StagesView';
import Steps from './StepsView';
import { Composer } from './styles';
import { ChecklistComposerProps } from './types';

const ChecklistComposer: FC<ChecklistComposerProps> = ({ checklistId }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const { checklist, loading } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!checklist && checklistId) {
      dispatch(fetchChecklist(checklistId));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (checklist) {
    return (
      <Composer>
        <div className="header">
          <div className="header-item">Stages</div>
          <span className="header-auto-save">
            All changes saved automatically
          </span>
          <Button>Publish Checklist</Button>
        </div>
        <Stages
          stages={checklist?.stages}
          activeStage={activeStage}
          setActiveStage={(index) => setActiveStage(index)}
        />
        <Steps
          steps={checklist?.stages[activeStage]?.steps}
          activeStage={activeStage + 1}
          stage={checklist?.stages[activeStage]}
        />
      </Composer>
    );
  } else {
    return null;
  }
};

export default ChecklistComposer;
