import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { InteractionViewProps } from './types';
import { updateInteraction } from './actions';

const MaterialInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <ol className="material-interaction">
      {interaction.data.map((el, index) => (
        <li key={index} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />

          <input
            className="form-input form-input-value"
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
          />

          <div className="material-interaction-item-controls">
            <Remove
              className="icon"
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
            <span className="quantity">{el.quantity || 1}</span>
            <Add
              className="icon"
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
