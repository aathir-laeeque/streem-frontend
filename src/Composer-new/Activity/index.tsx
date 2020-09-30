import { Delete } from '@material-ui/icons';
import React, { FC } from 'react';

import { MandatoryActivity, NonMandatoryActivity } from '../checklist.types';
import ChecklistActivity from './Checklist';
import InstructionActivity from './Instruction';
import MaterialActivity from './Material';
import MediaActivity from './Media';
import MultiSelectActivity from './MultiSelect';
import ParameterActivity from './Parameter';
import SignatureActivity from './Signature';
import { ActivityWrapper } from './styles';
import TextboxActivity from './Textbox';
import { ActivityProps } from './types';
import YesNoActivity from './YesNo';
import { useTypedSelector } from '../../store/helpers';
import { useDispatch } from 'react-redux';
import { deleteActivity } from './actions';

const Activity: FC<ActivityProps> = ({ activity, taskId }) => {
  const { activeStageId: stageId } = useTypedSelector(
    (state) => state.prototypeComposer.stages,
  );

  const dispatch = useDispatch();

  return (
    <ActivityWrapper>
      <Delete
        className="icon"
        id="delete"
        fontSize="small"
        onClick={() => {
          if (stageId) {
            dispatch(
              deleteActivity({ activityId: activity.id, taskId, stageId }),
            );
          }
        }}
      />
      {(() => {
        switch (activity.type) {
          case MandatoryActivity.CHECKLIST:
            return <ChecklistActivity activity={activity} />;

          case MandatoryActivity.MEDIA:
            return <MediaActivity activity={activity} />;

          case MandatoryActivity.MULTISELECT:
            return <MultiSelectActivity activity={activity} />;

          case MandatoryActivity.SHOULD_BE:
            return <ParameterActivity activity={activity} />;

          case MandatoryActivity.SIGNATURE:
            return <SignatureActivity activity={activity} />;

          case MandatoryActivity.TEXTBOX:
            return <TextboxActivity activity={activity} />;

          case MandatoryActivity.YES_NO:
            return <YesNoActivity activity={activity} />;

          case NonMandatoryActivity.INSTRUCTION:
            return <InstructionActivity activity={activity} />;

          case NonMandatoryActivity.MATERIAL:
            return <MaterialActivity activity={activity} />;

          default:
            return null;
        }
      })()}
    </ActivityWrapper>
  );
};

export default Activity;
