// alias imports
import { Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../../types';
import { updateInteraction } from './actions';
import { InteractionViewProps } from './types';

const ChecklistInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  // TODO: look into type of data for interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className={`form-input form-input-value${
            !isCreatingChecklist ? ' no-border' : ''
          }`}
          type="text"
          value={interaction.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Enter a title for the checklist"
          {...(!isCreatingChecklist && { disabled: true })}
        />
      </div>

      <div className="checklist-container">
        {interaction.data.map((el: any, index: number) => (
          <div className="list-item" key={index}>
            <Checkbox
              label={el.name}
              onClick={() =>
                update({
                  data: interaction.data.map((ele, i) => ({
                    ...ele,
                    ...(i === index && { value: !!!el.value }),
                  })),
                })
              }
              checked={!!el.value}
            />
            <Close className={`icon${!isCreatingChecklist ? ' hide' : ''}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistInteraction;
