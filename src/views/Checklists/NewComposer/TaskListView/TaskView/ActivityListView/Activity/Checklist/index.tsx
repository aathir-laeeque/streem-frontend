import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Close } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { ActivityProps, ActivitySelections } from '../types';
import { Wrapper } from './styles';
import { executeActivity } from '../actions';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  const [stateActivity, setStateActivity] = useState(activity);

  const dispatch = useDispatch();

  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="activity-header">Creating a checklist</div>

      <ul className="list-container">
        {stateActivity.data.map((el, index) => {
          const isItemSelected =
            get(activity?.response?.choices, el.id) ===
            ActivitySelections.SELECTED;

          return (
            <li key={index} className="list-item">
              <div
                className="item-content"
                onClick={() => {
                  if (!isEditing) {
                    console.log('dispatch execute activity action');

                    const temp = {
                      ...activity,
                      data: activity.data.map((e) => ({
                        ...e,
                        status:
                          e.id === el.id
                            ? isItemSelected
                              ? ActivitySelections.NOT_SELECTED
                              : ActivitySelections.SELECTED
                            : get(activity?.response?.choices, e.id) ||
                              ActivitySelections.NOT_SELECTED,
                      })),
                    };

                    dispatch(executeActivity(temp));

                    const temp2 = {
                      ...stateActivity,
                      response: {
                        ...stateActivity.response,
                        choices: {
                          ...stateActivity.response.choices,
                          [el.id]:
                            stateActivity.response.choices[el.id] ===
                            ActivitySelections.SELECTED
                              ? ActivitySelections.NOT_SELECTED
                              : ActivitySelections.SELECTED,
                        },
                      },
                    };

                    setStateActivity(temp2);
                  }
                }}
              >
                <div className="dummy-checkbox" />

                {isEditing ? (
                  <input
                    type="text"
                    value={el.name}
                    onChange={(e) =>
                      setStateActivity({
                        ...stateActivity,
                        data: stateActivity.data.map((x) => ({
                          ...x,
                          ...(x.id === el.id && { name: e.target.value }),
                        })),
                      })
                    }
                    disabled={!isEditing}
                  />
                ) : (
                  <div
                    className={
                      get(stateActivity?.response?.choices, el.id) ===
                      ActivitySelections.SELECTED
                        ? 'selected'
                        : ''
                    }
                  >
                    {el.name}
                  </div>
                )}
              </div>

              <Close className="icon" />
            </li>
          );
        })}

        {isEditing ? <AddNewItem onClick={() => {}} /> : null}
      </ul>
    </Wrapper>
  );
};

export default ChecklistActivity;
