import { Close, Maximize } from '@material-ui/icons';
import React, { FC } from 'react';

import { InteractionProps } from '../types';

const SignatureInteraction: FC<InteractionProps> = ({ interaction, index }) => {
  return (
    <div className="signature-interaction">
      <div className="icon-container">
        <Close className="icon" />
        <Maximize className="icon" />
      </div>

      <span>Signature upload will be enabled during execution</span>
    </div>
  );
};

export default SignatureInteraction;
