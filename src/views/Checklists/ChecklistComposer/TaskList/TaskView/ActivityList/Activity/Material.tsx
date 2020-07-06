import { Add, Remove } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivityData } from './actions';
import { ActivityProps, updateDataParams } from './types';

const Material: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const updateData = (data: updateDataParams) =>
    dispatch(updateActivityData(data));

  // TODO: look into any type
  return (
    <ol className="material-interaction">
      {activity.data.map((el: any, idx: number) => (
        <li key={idx} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />

          <input
            className="form-field-input"
            type="text"
            name="material"
            value={el.name}
            onChange={(e) =>
              updateData({
                data: activity.data.map((ele: any, i: number) => ({
                  ...ele,
                  ...(i === idx && { name: e.target.value }),
                })),
                id: activity.id,
              })
            }
          />

          <div className="material-interaction-item-controls">
            <Remove
              className="icon"
              onClick={() =>
                updateData({
                  data: activity.data.map((ele: any, i: number) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) - 1 }),
                  })),
                  id: activity.id,
                })
              }
            />
            <span className="quantity">{el.quantity || 0}</span>
            <Add
              className={`icon`}
              onClick={() =>
                updateData({
                  data: activity.data.map((ele: any, i: number) => ({
                    ...ele,
                    ...(i === idx && { quantity: (el.quantity || 0) + 1 }),
                  })),
                  id: activity.id,
                })
              }
            />
          </div>
        </li>
      ))}

      <div
        className="add-new-item"
        onClick={() =>
          updateData({
            data: [...activity.data, { name: '', quantity: 0, link: '' }],
            id: activity.id,
          })
        }
      >
        <Add className="icon" />
        Add new Item
      </div>
    </ol>
  );
};

export default Material;
