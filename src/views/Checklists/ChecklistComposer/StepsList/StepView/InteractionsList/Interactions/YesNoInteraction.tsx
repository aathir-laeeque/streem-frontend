import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateInteraction } from '../actions';
import { InteractionProps } from '../types';

const YesNoInteraction: FC<InteractionProps> = ({ interaction, index }) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction
  const update = (data: any) => dispatch(updateInteraction({ ...data }, index));

  return (
    <div className="yes-no-interaction">
      <div className="form-field">
        <label className="form-field-label">Label</label>
        <input
          className="form-field-input"
          type="text"
          value={interaction.label}
          onChange={(e) => update({ label: e.target.value })}
        />
      </div>
      <div className="buttons-container">
        {interaction.data
          .sort((a, b) => (a.name > b.name ? -1 : 1)) // sorting to make yes type come first
          .map((el, index) => (
            <div key={index} className="button-item">
              <div className="form-field">
                <label className="form-field-label">
                  {el.type === 'yes' ? 'Positive' : 'Negative'} Button Label
                </label>
                <input
                  className="form-field-input"
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
