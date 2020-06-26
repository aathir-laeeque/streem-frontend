import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { InteractionViewProps } from './types';
import { updateInteraction } from './actions';
import { useTypedSelector } from '#store';
import { ChecklistState } from '../../../types';

const MaterialInteraction: FC<InteractionViewProps> = ({
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
    <ol className="material-interaction">
      {!isCreatingChecklist ? (
        <li className="material-interaction-item-header">
          <div>Name</div>
          <div>Quantity</div>
        </li>
      ) : null}
      {interaction.data.map((el, index) => (
        <li key={index} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />

          <input
            className={`form-input form-input-value${
              !isCreatingChecklist ? ' no-border' : ''
            }`}
            type="text"
            name="material"
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
            {...(!isCreatingChecklist && { disabled: true })}
          />

          <div
            className={`material-interaction-item-controls${
              !isCreatingChecklist ? ' no-border' : ''
            }`}
          >
            <Remove
              className={`icon${!isCreatingChecklist ? ' hide' : ''}`}
              onClick={() =>
                update({
                  data: [
                    ...interaction.data.map((ele, i) => ({
                      ...ele,
                      ...(i === index && { quantity: el.quantity - 1 }),
                    })),
                  ],
                })
              }
            />
            <span
              className={`quantity${!isCreatingChecklist ? ' no-border' : ''}`}
            >
              {el.quantity || 0}
            </span>
            <Add
              className={`icon${!isCreatingChecklist ? ' hide' : ''}`}
              onClick={() =>
                update({
                  data: [
                    ...interaction.data.map((ele, i) => ({
                      ...ele,
                      ...(i === index && { quantity: el.quantity + 1 }),
                    })),
                  ],
                })
              }
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MaterialInteraction;
