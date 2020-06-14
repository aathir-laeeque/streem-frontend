import React, { FC } from 'react';
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';

import { InteractionsViewProps } from './types';
import ChecklistInteraction from './ChecklistInteraction';
import InstructionInteraction from './InstructionInteraction';
import MaterialInteraction from './MaterialInteraction';
import ShouldBeInteraction from './ShouldBeInteraction';
import YesNoInteraction from './YesNoInteraction';

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
          console.log('interaction :: ', interaction);

          switch (interaction.type) {
            case 'MATERIAL':
              return <MaterialInteraction interaction={interaction} />;

            case 'INSTRUCTION':
              return <InstructionInteraction interaction={interaction} />;

            case 'YESNO':
              return <YesNoInteraction interaction={interaction} />;

            case 'CHECKLIST':
              return <ChecklistInteraction interaction={interaction} />;

            case 'SHOULDBE':
              return <ShouldBeInteraction interaction={interaction} />;

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
