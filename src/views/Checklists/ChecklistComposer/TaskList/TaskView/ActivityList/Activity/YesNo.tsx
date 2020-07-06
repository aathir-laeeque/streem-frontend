import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivityData, updateActivity } from './actions';
import { ActivityProps, updateDataParams, updateActivityParams } from './types';

const YesNoInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction
  const updateData = (data: updateDataParams) =>
    dispatch(updateActivityData(data));

  const update = (data: updateActivityParams) => dispatch(updateActivity(data));

  return (
    <div className="yes-no-interaction">
      <div className="form-field">
        <label className="form-field-label">Label</label>
        <input
          className="form-field-input"
          type="text"
          value={activity.label}
          onChange={(e) => update({ label: e.target.value, id: activity.id })}
        />
      </div>
      <div className="buttons-container">
        {activity.data
          .sort((a: any, b: any) => (a.name > b.name ? -1 : 1)) // sorting to make yes type come first
          .map((el: any, index: number) => (
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
                    updateData({
                      data: activity.data.map((ele: any, i: number) => ({
                        ...ele,
                        ...(i === index && { name: e.target.value }),
                      })),
                      id: activity.id,
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
