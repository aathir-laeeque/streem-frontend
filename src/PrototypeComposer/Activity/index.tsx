import { ToggleSwitch } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { Delete } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { MandatoryActivity, NonMandatoryActivity } from '../checklist.types';
import { deleteActivity, updateActivity } from './actions';
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

const Activity: FC<ActivityProps> = ({ activity, taskId }) => {
  const { activeStageId: stageId } = useTypedSelector(
    (state) => state.prototypeComposer.stages,
  );

  const dispatch = useDispatch();

  const deleteActivityProps = {
    header: 'Delete Activity',
    body: (
      <>
        <span>Are you sure you want to Delete this Activity ? </span>
        <span>Your work in progress will be lost.</span>
      </>
    ),
    onPrimaryClick: () => {
      if (stageId) {
        dispatch(deleteActivity({ activityId: activity.id, taskId, stageId }));
      }
    },
  };

  return (
    <ActivityWrapper>
      <Delete
        className="icon"
        id="delete"
        fontSize="small"
        onClick={() => {
          if (stageId) {
            dispatch(
              openOverlayAction({
                type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                props: deleteActivityProps,
              }),
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
          case MandatoryActivity.SINGLE_SELECT:
            return <MultiSelectActivity activity={activity} />;

          case MandatoryActivity.SHOULD_BE:
          case MandatoryActivity.PARAMETER:
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

      {(() => {
        let offLabel = 'Optional',
          onLabel = 'Requried';

        if (activity.type === MandatoryActivity.CHECKLIST) {
          offLabel = 'All Optional';
          onLabel = 'All Required';
        }

        if (
          activity.type === MandatoryActivity.MULTISELECT ||
          activity.type === MandatoryActivity.SINGLE_SELECT
        ) {
          onLabel = 'One Required';
        }

        if (activity.type in MandatoryActivity) {
          return (
            <ToggleSwitch
              offLabel={offLabel}
              onChange={(isChecked) => {
                dispatch(updateActivity({ ...activity, mandatory: isChecked }));
              }}
              onColor="#5aa700"
              onLabel={onLabel}
              uncheckedIcon={false}
              value={activity.mandatory}
            />
          );
        }
      })()}
    </ActivityWrapper>
  );
};

export default Activity;
