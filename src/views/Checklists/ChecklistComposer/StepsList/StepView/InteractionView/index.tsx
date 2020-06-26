import { useTypedSelector } from '#store';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { ChecklistState } from '../../../types';
import ChecklistInteraction from './ChecklistInteraction';
import InstructionInteraction from './InstructionInteraction';
import MaterialInteraction from './MaterialInteraction';
import ShouldBeInteraction from './ShouldBeInteraction';
import SignatureInteraction from './SignatureInteraction';
import { Wrapper } from './styles';
import TextboxInteraction from './TextboxInteraction';
import { InteractionType, InteractionViewProps } from './types';
import YesNoInteraction from './YesNoInteraction';

const InteractionView: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <div
        className={`step-interaction-position-control${
          !isCreatingChecklist ? ' hide' : ''
        }`}
      >
        <ArrowUpwardOutlined className="icon arrow-up" />
        {/* <span>{interactionIndex + 1}</span> */}
        <ArrowDownwardOutlined className="icon arrow-down" />
      </div>

      <div className="step-interaction-container">
        {(() => {
          switch (interaction.type) {
            case InteractionType.MATERIAL:
              return (
                <MaterialInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.INSTRUCTION:
              return (
                <InstructionInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.YESNO:
              return (
                <YesNoInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.CHECKLIST:
              return (
                <ChecklistInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.SHOULDBE:
              return (
                <ShouldBeInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.TEXTBOX:
              return (
                <TextboxInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            case InteractionType.SIGNATURE:
              return (
                <SignatureInteraction
                  interaction={interaction}
                  interactionIndex={interactionIndex}
                />
              );

            default:
              return null;
          }
        })()}
      </div>

      <MoreVertOutlined
        className={`icon more-options${!isCreatingChecklist ? ' hide' : ''}`}
      />
    </Wrapper>
  );
};

export default InteractionView;
