import React, { FC } from 'react';
import { Maximize, Close } from '@material-ui/icons';

import { InteractionViewProps } from './types';

const SignatureInteraction: FC<InteractionViewProps> = () => {
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
