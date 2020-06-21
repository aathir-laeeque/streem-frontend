import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import ChecklistInteraction from './ChecklistInteraction';
import InstructionInteraction from './InstructionInteraction';
import MaterialInteraction from './MaterialInteraction';
import ShouldBeInteraction from './ShouldBeInteraction';
import { InteractionsViewProps, InteractionType } from './types';
import YesNoInteraction from './YesNoInteraction';
import TextboxInteraction from './TextboxInteraction';
import SignatureInteraction from './SignatureInteraction';

const InteractionsView: FC<InteractionsViewProps> = ({ interactions }) => (
  <div className="step-interactions">
    {interactions.map((interaction, index) => (
      <div className="step-interaction" key={index}>
        {index === 0 ? (
          <ArrowDownwardOutlined className="icon sort-arrow" />
        ) : (
          <ArrowUpwardOutlined className="icon sort-arrow" />
        )}

        {(() => {
          switch (interaction.type) {
            case InteractionType.MATERIAL:
              return <MaterialInteraction interaction={interaction} />;

            case InteractionType.INSTRUCTION:
              return <InstructionInteraction interaction={interaction} />;

            case InteractionType.YESNO:
              return <YesNoInteraction interaction={interaction} />;

            case InteractionType.CHECKLIST:
              return <ChecklistInteraction interaction={interaction} />;

            case InteractionType.SHOULDBE:
              return <ShouldBeInteraction interaction={interaction} />;

            case InteractionType.TEXTBOX:
              return <TextboxInteraction interaction={interaction} />;

            case InteractionType.SIGNATURE:
              return <SignatureInteraction interaction={interaction} />;

            default:
              return null;
          }
        })()}

        <MoreVertOutlined className="icon more-options" />
      </div>
    ))}
  </div>
);

export default InteractionsView;
