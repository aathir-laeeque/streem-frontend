import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../../types';
import { updateInteraction, executeInteraction } from './actions';
import { InteractionViewProps } from './types';

const YesNoInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  // TODO: look into type for data in interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <div className="yes-no-interaction">
      <div className="form-field">
        <label
          className={`form-input-label${!isCreatingChecklist ? ' hide' : ''}`}
        >
          Label
        </label>
        <input
          className={`form-input form-input-value${
            !isCreatingChecklist ? ' no-border' : ''
          }`}
          type="text"
          value={interaction.label}
          onChange={(e) => update({ label: e.target.value })}
          {...(!isCreatingChecklist && { disabled: true })}
        />
      </div>
      <div className="buttons-container">
        {interaction.data.map((el, index) => (
          <div key={index} className="button-item">
            <div className={`form-field${!isCreatingChecklist ? ' hide' : ''}`}>
              <label className="form-input-label">
                {el.type === 'yes' ? 'Positive' : 'Negative'} Button Label
              </label>
              <input
                className={`form-input form-input-value${
                  !isCreatingChecklist ? ' no-border' : ''
                }`}
                type="text"
                value={el.name}
                onChange={(e) =>
                  update({
                    data: [
                      ...interaction.data.map((ele, i) => ({
                        ...ele,
                        ...(i === index && { name: e.target.value }),
                      })),
                    ],
                  })
                }
              />
            </div>
            <button
              className={`${el.type}-button`}
              onClick={() =>
                !isCreatingChecklist
                  ? dispatch(executeInteraction(interaction, el))
                  : undefined
              }
            >
              {el.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YesNoInteraction;
