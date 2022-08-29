import { Button1, Textarea, TextInput } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { EnabledStates } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { Error } from '#utils/globalTypes';
import { EquationNode, EquationParserError, parse } from 'equation-parser';
import {
  createResolverFunction,
  defaultFunctions,
  EquationResolveError,
  format,
  resolve,
  VariableLookup,
} from 'equation-resolver';
import { debounce, isEmpty } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Equation, EquationOptions } from 'react-equation';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateActivityApi, updateStoreActivity } from '../actions';
import ActivityLabelInput from '../ActivityLabelInput';
import { ActivityProps, CalcActivityErrors } from '../types';

const CalculationActivityView = styled.div`
  > label {
    font-size: 14px;
  }
  .calc-uom {
    .input-label {
      color: #000000;
    }
  }

  .calc-desc,
  .calc-formula-input,
  .formula-preview-wrapper {
    label {
      font-size: 14px;
      color: #000000;
      margin-bottom: 8px;
    }
  }

  .calc-uom,
  .calc-desc,
  .calc-formula-input,
  .add-params-btn,
  .add-params-wrapper,
  .formula-preview-wrapper {
    margin-top: 16px;
  }

  .add-params-wrapper {
    .add-params-label {
      font-size: 12px;
      color: #6f6f6f;
      margin-bottom: 8px;
    }
    .add-params {
      font-size: 14px;
      color: #161616;
    }
  }

  .formula-preview-wrapper {
    .formula {
      font-size: 14px;
      color: #161616;

      div:not(:first-child) {
        display: none;
      }
    }
  }
`;

const comparisons = [
  'equals',
  'less-than',
  'greater-than',
  'less-than-equals',
  'greater-than-equals',
  'approximates',
];

const math = (equationsArr: string[], defaultVariables: VariableLookup) => {
  const variables: VariableLookup = { ...defaultVariables };
  const functions = { ...defaultFunctions };
  const equations = equationsArr.map((input) => {
    const [inputEquation, inputUnit] = input.split(':');

    const node = parse(inputEquation);

    if (node.type === 'equals' && node.a.type === 'variable') {
      const value = resolve(node.b, { variables, functions });
      if (value.type !== 'resolve-error') {
        variables[node.a.name] = value;
      }
    } else if (
      node.type === 'equals' &&
      node.a.type === 'function' &&
      node.a.args.every((arg) => arg.type === 'variable')
    ) {
      const { name, args } = node.a;
      functions[name] = createResolverFunction(
        args.map((arg) => arg.name),
        node.b,
        { variables, functions },
      );
    }

    const formatted = comparisons.includes(node.type)
      ? node
      : format(node, inputUnit ? parse(inputUnit) : null, {
          variables,
          functions,
        });

    return formatted;
  });

  return equations;
};

const getEquationError = (
  parsedEquation: (EquationNode | EquationParserError | EquationResolveError)[],
  activityErrors: Error[],
) => {
  if (activityErrors.length) {
    const message = activityErrors.find(
      (error) =>
        error.code === 'E433' ||
        error.code === 'E434' ||
        error.code === 'E436' ||
        error.code === 'E437',
    )?.message;

    if (message) {
      return message;
    }
  }
  if (parsedEquation && parsedEquation.length && parsedEquation[0].type.includes('error')) {
    switch ((parsedEquation[0] as any).errorType) {
      case 'operatorLast':
        return 'Invalid operator add to the end of the equation';
      case 'variableUnknown':
        return `Unknown variable ${(parsedEquation[0] as any).name}`;
      case 'invalidChar':
        return `Invalid character ${(parsedEquation[0] as any).character}`;
      default:
        return `Invalid Input`;
    }
  }
};

const CalculationActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);
  const { data } = useTypedSelector((state) => state.prototypeComposer);

  useEffect(() => {
    if (componentLoaded) {
      dispatch(updateActivityApi({ ...activity }));
    } else if (activity) {
      updateComponentLoaded(true);
    }
  }, [activity]);

  const equations = (activity.data.expression as string)
    .split(/\n/g)
    .map((s) => s.trim())
    .filter((s) => s);

  const defaultVariables = Object.keys(activity.data.variables).reduce(
    (acc: VariableLookup, variableName: string) => {
      acc[variableName] = { type: 'number', value: 1 };
      return acc;
    },
    {},
  );
  const parsedEquations = math(equations, defaultVariables);
  const equationError = getEquationError(parsedEquations, activity.errors);

  return (
    <CalculationActivityView>
      <label>Calculation</label>
      <ActivityLabelInput activity={activity} isControlled />
      <div className="calc-desc">
        <Textarea
          placeholder="Placeholder text"
          defaultValue={activity.description || undefined}
          rows={4}
          label="Description"
          onChange={debounce(({ value }) => {
            dispatch(updateStoreActivity(value, activity.id, ['description']));
          }, 500)}
        />
      </div>
      <div className="calc-uom">
        <TextInput
          error={
            (activity.errors.length &&
              activity.errors.find((error) => error.code === 'E435')?.message) ||
            null
          }
          placeholder="Placeholder text"
          defaultValue={activity.data.uom}
          label="Unit of Measurement"
          onChange={debounce(({ value }) => {
            dispatch(updateStoreActivity(value, activity.id, ['data', 'uom']));
          }, 500)}
        />
      </div>
      {data?.state && data.state in EnabledStates && (
        <Button1
          variant="textOnly"
          onClick={() => {
            dispatch(
              openOverlayAction({
                type: OverlayNames.CALC_ACTIVITY_ADD_PARAMS_MODAL,
                props: {
                  activityId: activity.id,
                  variables: activity.data.variables,
                },
              }),
            );
          }}
          className="add-params-btn"
        >
          Add Parameters
        </Button1>
      )}
      {!isEmpty(activity.data.variables) && (
        <div className="add-params-wrapper">
          <div className="add-params-label">Added Parameters</div>
          {Object.entries(activity.data.variables).map(([variableName, variableObj], index) => (
            <div key={index} className="added-param">
              {variableName}: {(variableObj as { label: string }).label}
            </div>
          ))}
        </div>
      )}
      <div className="calc-formula-input">
        <Textarea
          defaultValue={activity.data.expression}
          label="Write Calculation"
          rows={4}
          onChange={debounce(({ value }) => {
            Object.keys(activity.data.variables).forEach((name) => {});
            dispatch(updateStoreActivity(value, activity.id, ['data', 'expression']));
          }, 500)}
          placeholder="Placeholder text"
          error={equationError}
        />
      </div>
      <div className="formula-preview-wrapper">
        <label>Preview:</label>
        <EquationOptions variables={defaultVariables}>
          {parsedEquations.map((node, idx) => (
            <div key={idx}>
              <Equation className="formula" value={activity.data.expression as string} />
            </div>
          ))}
        </EquationOptions>
      </div>
    </CalculationActivityView>
  );
};

export default CalculationActivity;
