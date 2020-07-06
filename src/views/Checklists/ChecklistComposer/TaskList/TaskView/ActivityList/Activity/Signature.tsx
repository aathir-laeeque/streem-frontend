import { Close, Maximize } from '@material-ui/icons';
import React, { FC } from 'react';

import { ActivityProps } from './types';

const Signature: FC<ActivityProps> = ({ activity }) => {
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

export default Signature;
