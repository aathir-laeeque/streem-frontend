import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React from 'react';
import { formValueSelector } from 'redux-form';

import ChecklistInteraction from './ChecklistInteraction';
import InstructionInteraction from './InstructionInteraction';
import MaterialInteraction from './MaterialInteraction';
import ShouldBeInteraction from './ShouldBeInteraction';
import SignatureInteraction from './SignatureInteraction';
import { Wrapper } from './styles';
import TextboxInteraction from './TextboxInteraction';
import { InteractionType } from './types';
import YesNoInteraction from './YesNoInteraction';
import { useTypedSelector } from '#store';

// TODO: look in to the type of fields
const InteractionsView = ({ field }) => {
  const formSelector = formValueSelector('stepsListForm');

  const { interaction } = useTypedSelector((state) => ({
    interaction: formSelector(state, field),
  }));

  // field is of format steps[2].interactions[0], so spliting at . and getting index from the remaining string
  // const index = parseInt(field.split('.')[1].replace(/[^0-9]/g, ''));

  if (
    interaction.type === InteractionType.MEDIA ||
    interaction.type === InteractionType.MULTISELECT
  )
    return null;

  return (
    <Wrapper>
      <div className="step-interaction-position-control">
        <ArrowUpwardOutlined className="icon arrow-up" />
        {/* <span>{index + 1}</span> */}
        <ArrowDownwardOutlined className="icon arrow-down" />
      </div>

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
    </Wrapper>
  );
};

export default InteractionsView;
