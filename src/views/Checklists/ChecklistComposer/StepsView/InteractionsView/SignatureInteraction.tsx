import React, { FC } from 'react';
import { Maximize, Close } from '@material-ui/icons';

import { InteractionViewProps } from './types';

const SignatureInteraction: FC<InteractionViewProps> = () => (
  <div className="step-interaction-container">
    <div className="signature-interaction">
      <div className="icon-container">
        <Close className="icon" />
        <Maximize className="icon" />
      </div>
      <span>Signature upload will be enabled during execution</span>
    </div>
  </div>
);

export default SignatureInteraction;
