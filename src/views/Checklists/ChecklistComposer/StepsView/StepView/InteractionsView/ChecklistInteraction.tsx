import React, { FC } from 'react';
import { Close } from '@material-ui/icons';
import { noop } from 'lodash';

import { InteractionViewProps } from './types';
import { Checkbox } from '../../../../../../components';

const ChecklistInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className="form-input form-input-value"
          type="text"
          onChange={undefined}
          placeholder="Enter a title for the checklist"
        />
      </div>

      <div className="checklist-container">
        {interaction.data.map((el: any, index: number) => (
          <div className="list-item" key={index}>
            <Checkbox label={el.name} onClick={noop} />
            <Close className="icon" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ChecklistInteraction;
