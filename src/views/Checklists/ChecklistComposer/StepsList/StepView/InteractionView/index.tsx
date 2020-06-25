import React, { FC } from 'react';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';

import { InteractionViewProps, InteractionType } from './types';
import { Wrapper } from './styles';
import MaterialInteraction from './MaterialInteraction';
import InstructionInteraction from './InstructionInteraction';
import YesNoInteraction from './YesNoInteraction';
import ChecklistInteraction from './ChecklistInteraction';
import ShouldBeInteraction from './ShouldBeInteraction';
import TextboxInteraction from './TextboxInteraction';
import SignatureInteraction from './SignatureInteraction';

const InteractionView: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  return (
    <Wrapper>
      <div className="step-interaction-position-control">
        <ArrowUpwardOutlined className="icon arrow-up" />
        {/* <span>{index + 1}</span> */}
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

      <MoreVertOutlined className="icon more-options" />
    </Wrapper>
  );
};

export default InteractionView;
