import { useTypedSelector } from '#store';
import { Close, Maximize } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../../types';
import { updateInteraction } from './actions';
import { InteractionViewProps } from './types';

const SignatureInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  // TODO: look into type of data in interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <div className="signature-interaction">
      <div className="icon-container">
        <Close className="icon" />
        <Maximize className="icon" />
      </div>

      <span onClick={() => update({})}>
        {isCreatingChecklist
          ? 'Signature upload will be enabled during execution'
          : 'Tap here to record your signature'}
      </span>
    </div>
  );
};

export default SignatureInteraction;
