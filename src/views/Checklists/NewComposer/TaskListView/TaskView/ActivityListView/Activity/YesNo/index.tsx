import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { executeActivity } from '../actions';
import { ActivityProps, ActivitySelections } from '../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .buttons-container {
    display: flex;
    margin-top: 12px;

    .button-item {
      flex: 1;

      &.editing {
        flex: 0;
      }

      button {
        background-color: transparent;
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 0.16px;
        line-height: 1.29;
        padding: 5px 20px;
      }

      :first-child {
        input {
          background-color: #e1fec0;
          border-bottom-color: #27ae60;

          :active,
          :focus {
            border-color: #27ae60;
          }
        }

        button {
          border: 1px solid #5aa700;
          border-radius: 4px;
          color: #5aa700;

          &.filled {
            color: #ffffff;
            background-color: #427a00;
          }
        }
      }

      :last-child {
        margin-left: 20px;

        input {
          background-color: #ffebeb;
          border-bottom-color: #eb5757;

          :active,
          :focus {
            border-color: #eb5757;
          }
        }

        button {
          border: 1px solid #ff6b6b;
          border-radius: 4px;
          color: #ff6b6b;

          &.filled {
            color: #ffffff;
            background-color: #cc5656;
          }
        }
      }
    }
  }
`;

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
              onChange={(e) => {
                e.persist();
                customOnChange(e, (event) => {
                  console.log(
                    'event.target.value from activity label :: ',
                    event.target.value,
                  );
                });
              }}
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
                      onChange={(e) => {
                        e.persist();
                        customOnChange(e, (event) => {
                          console.log(
                            `event.target.value from activity data at index ${index}:: `,
                            event.target.value,
                          );
                        });
                      }}
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
