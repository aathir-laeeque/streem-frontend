import { CheckboxWithLabel, AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ACTIVITY_SELECTIONS } from '#utils/globalTypes';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, updateActivity } from '../actions';
import { Activity, ActivityProps } from '../types';
import { Wrapper } from './styles';
import { ChecklistState } from '#views/Checklists/types';

type ChecklistActivityData = {
  id: string;
  name: string;
};

const Checklist: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable, state } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (updatedActivity: Activity) =>
    dispatch(updateActivity(updatedActivity));

  const isTempalteEditable = state === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <div className="form-field">
        <input
          className="form-field-input"
          type="text"
          name="label"
          value={activity.label}
          onChange={(e) => update({ ...activity, label: e.target.value })}
          placeholder="Enter a title for the checklist"
          disabled={!isTempalteEditable}
        />
      </div>

      <div className="checklist-container">
        {(activity?.data as Array<ChecklistActivityData>).map((el, idx) => {
          const isItemSelected =
            get(activity?.response?.choices, el.id) ===
            ACTIVITY_SELECTIONS.SELECTED;

          return (
            <div className="list-item" key={idx}>
              <CheckboxWithLabel
                isChecked={
                  isChecklistEditable
                    ? false
                    : get(activity?.response?.choices, el.id) ===
                      ACTIVITY_SELECTIONS.SELECTED
                }
                disabled={isTempalteEditable}
                handleCheckboxChange={() => {
                  if (!isChecklistEditable) {
                    dispatch(
                      executeActivity({
                        ...activity,
                        data: (activity.data as Array<
                          ChecklistActivityData
                        >).map((e) => ({
                          ...e,
                          status:
                            e.id === el.id
                              ? isItemSelected
                                ? ACTIVITY_SELECTIONS.NOT_SELECTED
                                : ACTIVITY_SELECTIONS.SELECTED
                              : get(activity?.response?.choices, e.id) ||
                                ACTIVITY_SELECTIONS.NOT_SELECTED,
                        })),
                      }),
                    );
                  }
                }}
                handleLabelChange={(label) => {
                  update({
                    ...activity,
                    data: (activity.data as Array<ChecklistActivityData>).map(
                      (d, i) => ({
                        ...d,
                        ...(i === idx && { name: label }),
                      }),
                    ),
                  });
                }}
                label={el.name}
              />

              {isChecklistEditable ? (
                <Close
                  fontSize="small"
                  className="icon"
                  onClick={() =>
                    update({
                      ...activity,
                      data: (activity.data as Array<
                        ChecklistActivityData
                      >).filter((_, i) => i !== idx),
                    })
                  }
                />
              ) : null}
            </div>
          );
        })}

        {isChecklistEditable ? (
          <AddNewItem
            onClick={() =>
              update({
                ...activity,
                data: [...activity.data, { name: '' }],
              })
            }
          />
        ) : null}
      </div>
    </Wrapper>
  );
};

export default Checklist;
