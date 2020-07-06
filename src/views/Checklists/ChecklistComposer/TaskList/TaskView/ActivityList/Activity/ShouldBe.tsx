import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivityData } from './actions';
import { ActivityProps, updateDataParams } from './types';
import { TARGET_RULES } from './constants';

const ShouldBe: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  // TODO: look into type of data in the interaction
  const updateData = (data: updateDataParams) =>
    dispatch(updateActivityData(data));

  return (
    <div className="shouldbe-interaction">
      <div className="form-field">
        <label className="form-field-label">Parameter</label>
        <input
          className="form-field-input"
          name="parameter"
          type="text"
          value={activity.data[0].parameter}
          placeholder="Pressure"
          onChange={(e) =>
            updateData({
              data: activity.data.map((ele: any) => ({
                ...ele,
                parameter: e.target.value,
              })),
              id: activity.id,
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
          value={activity.data[0].type}
          placeholder="Type"
          onChange={(e) =>
            updateData({
              data: activity.data.map((ele: any) => ({
                ...ele,
                type: e.target.value,
              })),
              id: activity.id,
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
          value={activity.data[0].uom}
          placeholder="UOM"
          onChange={(e) =>
            updateData({
              data: activity.data.map((ele: any) => ({
                ...ele,
                uom: e.target.value,
              })),
              id: activity.id,
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
            value={activity.data[0].operator}
            onChange={(e) =>
              updateData({
                data: activity.data.map((ele: any) => ({
                  ...ele,
                  operator: e.target.value,
                })),
                id: activity.id,
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
            value={activity.data[0].target}
            placeholder="Value"
            onChange={(e) =>
              updateData({
                data: activity.data.map((ele: any) => ({
                  ...ele,
                  target: e.target.value,
                })),
                id: activity.id,
              })
            }
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-field-label">Observed</label>
        <input
          className="form-field-input"
          name="observed-value"
          type="text"
          placeholder="To be entered at execution"
          value={activity.data[0].value}
          onChange={(e) =>
            updateData({
              data: activity.data.map((ele: any) => ({
                ...ele,
                value: e.target.value,
              })),
              id: activity.id,
            })
          }
        />
      </div>
    </div>
  );
};

export default ShouldBe;
