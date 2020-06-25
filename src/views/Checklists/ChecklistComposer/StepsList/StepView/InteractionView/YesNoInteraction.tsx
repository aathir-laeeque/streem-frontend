import React, { FC } from 'react';

import { InteractionViewProps } from './types';
import { useDispatch } from 'react-redux';
import { updateInteraction } from './actions';

const YesNoInteraction: FC<InteractionViewProps> = ({
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
    <div className="yes-no-interaction">
      <div className="form-field">
        <label className="form-input-label">Label</label>
        <input
          className="form-input form-input-value"
          type="text"
          value={interaction.label}
          onChange={(e) => update({ label: e.target.value })}
        />
      </div>
      <div className="buttons-container">
        {interaction.data.map((el, index) => (
          <div key={index} className="button-item">
            <div className="form-field">
              <label className="form-input-label">
                {el.type === 'yes' ? 'Positive' : 'Negative'} Button Label
              </label>
              <input
                className="form-input form-input-value"
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
            <button className={`${el.type}-button`}>{el.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YesNoInteraction;
