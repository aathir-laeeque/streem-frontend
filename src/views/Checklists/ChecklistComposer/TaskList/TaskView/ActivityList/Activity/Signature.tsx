import { Close, Maximize } from '@material-ui/icons';
import React, { FC } from 'react';

import { ActivityProps } from './types';
import { useTypedSelector } from '#store';

const Signature: FC<ActivityProps> = ({ activity }) => {
  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  return (
    <div className="signature-interaction">
      <div className="icon-container">
        <Close className="icon" />
        <Maximize className="icon" />
      </div>

      <span>
        {isChecklistEditable
          ? 'Signature upload will be enabled during execution'
          : 'Tap here to record your signature'}
      </span>
    </div>
  );
};

export default Signature;
