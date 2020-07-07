import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { ActivityProps, Activity } from './types';

const YesNoInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <div className="yes-no-interaction">
      <div className="form-field no-margin">
        <label className="form-field-label">Label</label>
        <input
          className="form-field-input"
          type="text"
          value={activity.label}
          onChange={(e) => update({ ...activity, label: e.target.value })}
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
                    update({
                      ...activity,
                      data: activity.data.map((ele: any, i: number) => ({
                        ...ele,
                        ...(i === index && { name: e.target.value }),
                      })),
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
