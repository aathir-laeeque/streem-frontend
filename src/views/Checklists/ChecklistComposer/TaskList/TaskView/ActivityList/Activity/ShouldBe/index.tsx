import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, updateActivity } from '../actions';
import { TARGET_RULES } from '../constants';
import { Activity, ActivityProps } from '../types';

const ShouldBe: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (data: Activity) => dispatch(updateActivity(data));

  const execute = (data: Activity) => dispatch(executeActivity(data));

  return (
    <div className="shouldbe-interaction">
      {isChecklistEditable ? (
        <>
          <div className="form-field">
            <label className="form-field-label">Parameter</label>
            <input
              className="form-field-input"
              name="parameter"
              type="text"
              value={activity.data.parameter}
              placeholder="Pressure"
              onChange={(e) =>
                update({
                  ...activity,
                  data: { ...activity.data, parameter: e.target.value },
                })
              }
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">Type</label>
            <input
              className="form-field-input"
              name="type"
              type="text"
              value={activity.data.type}
              placeholder="Type"
              onChange={(e) =>
                update({
                  ...activity,
                  data: { ...activity.data, type: e.target.value },
                })
              }
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">UOM</label>
            <input
              className="form-field-input"
              name="uom"
              type="text"
              value={activity.data.uom}
              placeholder="UOM"
              onChange={(e) =>
                update({
                  ...activity,
                  data: { ...activity.data, uom: e.target.value },
                })
              }
            />
          </div>
          <div id="target-rules">
            <div className="form-field">
              <label className="form-field-label">Target</label>
              <select
                id="target-rule-select"
                className="form-field-select"
                defaultValue="Choose Here"
                value={activity.data.operator}
                onChange={(e) =>
                  update({
                    ...activity,
                    data: { ...activity.data, operator: e.target.value },
                  })
                }
              >
                {TARGET_RULES.map((rule, index) => (
                  <option key={index} value={rule.value}>
                    {rule.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-field-label">Value</label>
              <input
                className="form-field-input"
                name="target-value"
                type="text"
                value={activity.data.value}
                placeholder="Value"
                onChange={(e) =>
                  update({
                    ...activity,
                    data: { ...activity.data, value: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div className="form-field">
          <label className="form-field-label">Should be</label>
          <span
            style={{ fontSize: '20px', color: '#666666', marginTop: '8px' }}
          >
            Pressure ≤ {activity.data.value || 50} {activity.data.uom}
          </span>
        </div>
      )}
      <div className="form-field">
        <label className="form-field-label">Observed</label>
        <input
          className="form-field-input"
          name="observed-value"
          type="text"
          placeholder="To be entered at execution"
          value={activity?.response?.value}
          onChange={(e) =>
            execute({
              ...activity,
              data: { ...activity.data, input: e.target.value },
            })
          }
          disabled={!isChecklistEditable}
        />
      </div>
    </div>
  );
};

export default ShouldBe;
