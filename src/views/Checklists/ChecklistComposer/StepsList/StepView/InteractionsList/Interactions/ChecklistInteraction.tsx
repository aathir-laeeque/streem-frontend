import { Add, Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateInteraction } from '../actions';
import { InteractionProps } from '../types';

// TODO: fix the interaction UI when checklist is in executing or executed state
const ChecklistInteraction: FC<InteractionProps> = ({ interaction, index }) => {
  const dispatch = useDispatch();

  // TODO: look into type of data for interaction
  const update = (data: any) => dispatch(updateInteraction({ ...data }, index));

  return (
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className={`form-input form-input-value`}
          type="text"
          value={interaction.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Enter a title for the checklist"
        />
      </div>

      <div className="checklist-container">
        {interaction.data.map((el: any, index: number) => (
          <div className="list-item" key={index}>
            <input
              checked={false}
              className="form-field-input"
              onChange={() => console.log('toggle checkbox')}
              type="checkbox"
            />

            <input
              className="form-field-input"
              type="text"
              name="item-label"
              value={el.name}
              onChange={(e) =>
                update({
                  data: interaction.data.map((el, i) => ({
                    ...el,
                    ...(i === index && { name: e.target.value }),
                  })),
                })
              }
            />
            <Close
              className={`icon`}
              onClick={() =>
                update({ data: interaction.data.filter((_, i) => i !== index) })
              }
            />
          </div>
        ))}
        <div
          className="add-new-item"
          onClick={() => update({ data: [...interaction.data, { name: '' }] })}
        >
          <Add className="icon" />
          Add new Item
        </div>
      </div>
    </div>
  );
};

export default ChecklistInteraction;
