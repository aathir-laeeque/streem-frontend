import { useTypedSelector } from '#store';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../../types';
import { updateInteraction } from './actions';
import { TARGET_RULES } from './constants';
import { InteractionViewProps } from './types';

const ShouldBeInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  const [observedValue, setObservedValue] = useState<number | undefined>(
    undefined,
  );

  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  // TODO: look into type of data in the interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  // TODO: make SHouldbe interaction in executing state
  if (!isCreatingChecklist) {
    const operator = TARGET_RULES.find(
      (el) => el.value === interaction?.data[0]?.operator,
    )?.label;

    const value = interaction.data[0].value;
    const unit = interaction.data[0].uom;

    const temp = `Pressure ${operator} ${value} ${unit}`;

    return (
      <div
        className="shouldbe-interaction"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-input-label">Required Value</label>
          <div className="form-input-value">{temp}</div>
        </div>
        <div className="form-field" style={{ flex: 1, marginLeft: '15px' }}>
          <label className="form-input-label">Observed Value</label>
          <input
            className="form-input form-input-value"
            type="number"
            style={{ padding: 0 }}
            value={observedValue}
            onChange={(e) => setObservedValue(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="shouldbe-interaction">
      <div className="form-field">
        <label className="form-input-label">Parameter</label>
        <input
          className="form-input form-input-value"
          name="parameter"
          type="text"
          value={interaction.data[0].parameter}
          placeholder="Pressure"
          onChange={(e) =>
            update({
              data: interaction.data.map((ele) => ({
                ...ele,
                parameter: e.target.value,
              })),
            })
          }
        />
      </div>
      <div className="form-field">
        <label className="form-input-label">Type</label>
        <input
          className="form-input form-input-value"
          name="type"
          type="text"
          value={interaction.data[0].type}
          placeholder="Type"
          onChange={(e) =>
            update({
              data: interaction.data.map((ele) => ({
                ...ele,
                type: e.target.value,
              })),
            })
          }
        />
      </div>
      <div className="form-field">
        <label className="form-input-label">UOM</label>
        <input
          className="form-input form-input-value"
          name="uom"
          type="text"
          value={interaction.data[0].uom}
          placeholder="UOM"
          onChange={(e) =>
            update({
              data: interaction.data.map((ele) => ({
                ...ele,
                uom: e.target.value,
              })),
            })
          }
        />
      </div>
      <div id="target-rules">
        <div className="form-field">
          <label className="form-input-label">Target</label>
          <select
            id="target-rule-select"
            className="form-input"
            defaultValue="Choose Here"
            value={interaction?.data[0]?.operator}
            onChange={(e) =>
              update({
                data: interaction.data.map((ele) => ({
                  ...ele,
                  operator: e.target.value,
                })),
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
          <label className="form-input-label">Value</label>
          <input
            className="form-input form-input-value"
            name="target-value"
            type="text"
            // TODO 10 os made dedault value, remove this later
            value={interaction.data[0].target || 10}
            placeholder="Value"
            onChange={(e) =>
              update({
                data: interaction.data.map((ele) => ({
                  ...ele,
                  target: e.target.value,
                })),
              })
            }
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-input-label">Observed</label>
        <input
          className="form-input form-input-value"
          name="observed-value"
          type="text"
          placeholder="To be entered at execution"
          value={interaction.data[0].value}
          onChange={(e) =>
            update({
              data: interaction.data.map((ele) => ({
                ...ele,
                value: e.target.value,
              })),
            })
          }
        />
      </div>
    </div>
  );
};

export default ShouldBeInteraction;
