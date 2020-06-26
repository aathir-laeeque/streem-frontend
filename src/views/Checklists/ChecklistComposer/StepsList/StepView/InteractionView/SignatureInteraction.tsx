import { useTypedSelector } from '#store';
import { Close, Maximize } from '@material-ui/icons';
import React, { FC } from 'react';

import { ChecklistState } from '../../../types';
import { InteractionViewProps } from './types';

const SignatureInteraction: FC<InteractionViewProps> = () => {
  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  return (
    <div className="signature-interaction">
      <div className="icon-container">
        <Close className="icon" />
        <Maximize className="icon" />
      </div>
      {isCreatingChecklist ? (
        <span>Signature upload will be enabled during execution</span>
      ) : (
        <span>Tap here to record your signature</span>
      )}
    </div>
  );
};

export default SignatureInteraction;
