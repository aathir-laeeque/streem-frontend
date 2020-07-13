import { Checkbox } from '#components';
import { useTypedSelector } from '#store';
import { Add, Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, updateActivity } from './actions';
import { Activity, ActivityProps } from './types';

const Checklist: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (updatedActivity: Activity) =>
    dispatch(updateActivity(updatedActivity));

  return (
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className="form-field-input"
          type="text"
          name="label"
          value={activity.label}
          onChange={(e) => update({ ...activity, label: e.target.value })}
          placeholder="Enter a title for the checklist"
          disabled={!isChecklistEditable}
        />
      </div>

      <div className="checklist-container">
        {activity.data.map((el: any, idx: number) => {
          const isItemSelected =
            get(activity?.response?.choices, el.id) === 'selected';

          return (
            <div className="list-item" key={idx}>
              <Checkbox
                checked={isChecklistEditable ? false : isItemSelected}
                onClick={() => {
                  if (!isChecklistEditable) {
                    dispatch(
                      executeActivity({
                        ...activity,
                        data: activity.data.map((e: any) => ({
                          ...e,
                          status:
                            e.id === el.id
                              ? isItemSelected
                                ? 'not-selected'
                                : 'selected'
                              : get(activity?.response?.choices, e.id),
                        })),
                      }),
                    );
                  }
                }}
              />

              <input
                className="form-field-input"
                type="text"
                name="item-label"
                value={el.name}
                onChange={(e) =>
                  update({
                    ...activity,
                    data: activity.data.map((d: any, i: number) => ({
                      ...d,
                      ...(i === idx && { name: e.target.value }),
                    })),
                  })
                }
                disabled={isChecklistEditable ? false : true}
              />

              {isChecklistEditable ? (
                <Close
                  className={`icon`}
                  onClick={() =>
                    update({
                      ...activity,
                      data: activity.data.filter(
                        (_: any, i: number) => i !== idx,
                      ),
                    })
                  }
                />
              ) : null}
            </div>
          );
        })}

        {isChecklistEditable ? (
          <div
            className="add-new-item"
            onClick={() =>
              update({
                ...activity,
                data: [...activity.data, { name: '' }],
              })
            }
          >
            <Add className="icon" />
            Add new Item
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Checklist;
