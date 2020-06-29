import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateInteraction } from '../actions';
import { InteractionProps } from '../types';

const MaterialInteraction: FC<InteractionProps> = ({ interaction, index }) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction
  const update = (data: any) => dispatch(updateInteraction({ ...data }, index));

  return (
    <ol className="material-interaction">
      {interaction.data.map((el, idx) => (
        <li key={idx} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />

          <input
            className="form-field-input"
            type="text"
            name="material"
            value={el.name}
            onChange={(e) =>
              update({
                data: interaction.data.map((ele, i) => ({
                  ...ele,
                  ...(i === idx && { name: e.target.value }),
                })),
              })
            }
          />

          <div className="material-interaction-item-controls">
            <Remove
              className="icon"
              onClick={() =>
                update({
                  data: interaction.data.map((ele, i) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) - 1 }),
                  })),
                })
              }
            />
            <span className="quantity">{el.quantity || 0}</span>
            <Add
              className={`icon`}
              onClick={() =>
                update({
                  data: interaction.data.map((ele, i) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) + 1 }),
                  })),
                })
              }
            />
          </div>
        </li>
      ))}

      <div
        className="add-new-item"
        onClick={() =>
          update({
            data: [...interaction.data, { name: '', quantity: 0, link: '' }],
          })
        }
      >
        <Add className="icon" />
        Add new Item
      </div>
    </ol>
  );
};

export default MaterialInteraction;
