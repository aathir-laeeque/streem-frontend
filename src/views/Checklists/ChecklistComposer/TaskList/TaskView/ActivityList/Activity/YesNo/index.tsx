import { useTypedSelector } from '#store';
import { ACTIVITY_SELECTIONS } from '#utils/globalTypes';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, updateActivity } from '../actions';
import { Activity, ActivityProps } from '../types';
import { Wrapper } from './styles';
import { YesNoActivityData } from './types';
import { ChecklistState } from '#views/Checklists/types';

const YesNoInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { state } = useTypedSelector((state) => state.checklist.composer);

  // TODO: look into type for data in interaction

  const update = (data: Activity) => dispatch(updateActivity(data));

  const isChecklistEditable = state === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <div className="form-field no-margin">
        <label
          className={`form-field-label ${!isChecklistEditable ? 'hide' : ''}`}
        >
          Label
        </label>
        <input
          className="form-field-input"
          type="text"
          value={activity.label}
          onChange={(e) => update({ ...activity, label: e.target.value })}
          disabled={!isChecklistEditable}
        />
      </div>

      <div className="buttons-container">
        {(activity.data as Array<YesNoActivityData>)
          .sort((a, b) => (a.type > b.type ? -1 : 1)) // sorting to make yes type come first
          .map((el, index) => (
            <div key={index} className="button-item">
              {isChecklistEditable ? (
                <div
                  className={`form-field ${!isChecklistEditable ? 'hide' : ''}`}
                >
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
              ) : (
                <button
                  // className={`${el.type}-button`}
                  className={`${el.type}-button ${
                    get(activity?.response?.choices, [el.id]) === undefined
                      ? ''
                      : get(activity?.response?.choices, [el.id]) ===
                        ACTIVITY_SELECTIONS.SELECTED
                      ? 'filled'
                      : 'hide'
                  }`}
                  onClick={() =>
                    dispatch(
                      executeActivity({
                        ...activity,
                        data: activity.data.map((e: any) => ({
                          ...e,
                          status:
                            e.id === el.id
                              ? ACTIVITY_SELECTIONS.SELECTED
                              : ACTIVITY_SELECTIONS.NOT_SELECTED,
                        })),
                      }),
                    )
                  }
                >
                  {el.name}
                </button>
              )}
            </div>
          ))}
      </div>
    </Wrapper>
  );
};

export default YesNoInteraction;
