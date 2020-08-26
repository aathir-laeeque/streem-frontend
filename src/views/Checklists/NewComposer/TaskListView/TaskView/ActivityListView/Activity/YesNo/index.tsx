import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity } from '../actions';
import { ActivityProps, ActivitySelections } from '../types';
import { Wrapper } from './styles';

const YesNoActivity: FC<ActivityProps> = ({ activity }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper>
      {isEditing ? (
        <>
          <div className="new-form-field">
            <label className="new-form-field-label">Ask a question</label>
            <input
              className="new-form-field-input"
              type="text"
              name="label"
              value={activity.label}
              onChange={(e) => {}}
            />
          </div>

          <div className="buttons-container">
            {activity.data
              .sort((a, b) => (a.type > b.type ? -1 : 1))
              .map((el, index) => (
                <div key={index} className="button-item">
                  <div className="new-form-field">
                    <label className="new-form-field-label">
                      {el.type === 'yes' ? 'Positive' : 'Negative'} Response
                    </label>

                    <input
                      className="new-form-field-input"
                      type="text"
                      name={`data[${index}].name`}
                      value={el.name}
                      onChange={(e) => {}}
                    />
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <div>{activity.label}</div>

          <div className="buttons-container">
            {activity.data
              .sort((a, b) => (a.type > b.type ? -1 : 1))
              .map((el, index) => (
                <div key={index} className="button-item editing">
                  <button
                    className={`${
                      activity?.response?.choices[el.id] ===
                      ActivitySelections.SELECTED
                        ? 'filled'
                        : ''
                    }`}
                    onClick={() => {
                      dispatch(
                        executeActivity({
                          ...activity,
                          data: activity.data.map((x) => ({
                            ...x,
                            status:
                              x.id === el.id
                                ? ActivitySelections.SELECTED
                                : ActivitySelections.NOT_SELECTED,
                          })),
                        }),
                      );
                    }}
                  >
                    {el.name}
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default YesNoActivity;
