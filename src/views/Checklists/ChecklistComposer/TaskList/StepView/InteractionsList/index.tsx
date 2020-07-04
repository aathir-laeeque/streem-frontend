import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { Wrapper } from './styles';
import { InteractionsListProps, InteractionType } from './types';
import {
  ChecklistInteraction,
  InstructionInteraction,
  MaterialInteraction,
  ShouldBeInteraction,
  SignatureInteraction,
  TextboxInteraction,
  YesNoInteraction,
} from './Interactions';

const InteractionsList: FC<InteractionsListProps> = ({ interactions }) => {
  return (
    <Wrapper>
      {interactions.map((interaction, index) => (
        <div className="interaction" key={index}>
          <div className="interaction-position-control">
            <ArrowUpwardOutlined className="icon arrow-up" />
            {/* <span>{interactionIndex + 1}</span> */}
            <ArrowDownwardOutlined className="icon arrow-down" />
          </div>

          <div className="interaction-content">
            {(() => {
              switch (interaction.type) {
                case InteractionType.CHECKLIST:
                  return (
                    <ChecklistInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.INSTRUCTION:
                  return (
                    <InstructionInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.MATERIAL:
                  return (
                    <MaterialInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.MEDIA:
                  break;

                case InteractionType.MULTISELECT:
                  break;

                case InteractionType.SHOULDBE:
                  return (
                    <ShouldBeInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.SIGNATURE:
                  return (
                    <SignatureInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.TEXTBOX:
                  return (
                    <TextboxInteraction
                      interaction={interaction}
                      index={index}
                    />
                  );
                  break;

                case InteractionType.YESNO:
                  return (
                    <YesNoInteraction interaction={interaction} index={index} />
                  );
                  break;

                default:
                  return <span>{interaction.type}</span>;
              }
            })()}
          </div>

          <MoreVertOutlined className={`icon more-options`} />
        </div>
      ))}
    </Wrapper>
  );
};

export default InteractionsList;
