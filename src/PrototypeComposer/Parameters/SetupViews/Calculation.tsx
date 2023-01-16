import { Button, selectStyles, Textarea, TextInput } from '#components';
import { MandatoryParameter, ParameterType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetParameters } from '#utils/apiUrls';
import { FilterOperators } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Add, Clear, DragHandle } from '@material-ui/icons';
import { EquationNode, EquationParserError, parse } from 'equation-parser';
import {
  createResolverFunction,
  defaultFunctions,
  EquationResolveError,
  format,
  resolve,
  VariableLookup,
} from 'equation-resolver';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import Select from 'react-select';
import { CommonWrapper } from './styles';

const comparisons = [
  'equals',
  'less-than',
  'greater-than',
  'less-than-equals',
  'greater-than-equals',
  'approximates',
];

const getEquationError = (
  parsedEquation: (EquationNode | EquationParserError | EquationResolveError)[],
) => {
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
        args.map((arg: any) => arg.name),
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

const CalculationParameter: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const { id: checklistId } = useTypedSelector((state) => state.prototypeComposer.data!);
  const {
    parameters: { addParameter },
  } = useTypedSelector((state) => state.prototypeComposer);
  const { register, watch, setValue, errors, setError, clearErrors } = form;
  const variables = watch('data.variables', {});
  const expression = watch('data.expression', '');

  const [loading, setLoading] = useState<Boolean>(false);
  const [parametersForCalc, updateParametersForCalc] = useState<
    { id: string; type: ParameterType; label: string; taskId: string }[]
  >([]);

  const equations = (expression as string)
    .split(/\n/g)
    .map((s) => s.trim())
    .filter((s) => s);

  const defaultVariables = Object.keys(variables).reduce(
    (acc: VariableLookup, variableName: string) => {
      acc[variableName] = { type: 'number', value: 1 };
      return acc;
    },
    {},
  );
  const parsedEquations = math(equations, defaultVariables);
  const equationError = getEquationError(parsedEquations);

  const getParametersForCalc = async () => {
    if (checklistId) {
      setLoading(true);
      const parametersForCalc = await request(
        'GET',
        apiGetParameters(
          checklistId,
          [
            MandatoryParameter.NUMBER,
            MandatoryParameter.CALCULATION,
            MandatoryParameter.SHOULD_BE,
          ].toString(),
        ),
        addParameter?.parameterId
          ? {
              params: {
                filters: JSON.stringify({
                  op: FilterOperators.AND,
                  fields: [
                    {
                      field: 'id',
                      op: FilterOperators.NE,
                      values: [addParameter.parameterId],
                    },
                  ],
                }),
              },
            }
          : undefined,
      );
      updateParametersForCalc(parametersForCalc.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    register('data.variables');
    getParametersForCalc();
  }, []);

  useEffect(() => {
    if (equationError) {
      setError('data.expression', {
        message: equationError,
      });
    } else {
      clearErrors('data.expression');
    }
  }, [equationError]);

  return (
    <CommonWrapper>
      <TextInput
        type="text"
        name={`data.uom`}
        label="Unit of Measurement"
        disabled={isReadOnly}
        ref={register({
          required: true,
        })}
      />
      <ul className="list" {...(isReadOnly && { style: { marginBottom: '16px' } })}>
        {Object.entries(variables).map(([variableName, value]: [string, any], index) => {
          return (
            <li className="list-item" key={variableName}>
              <TextInput
                placeholder="X"
                type="text"
                label="Parameter Name"
                defaultValue={variableName === 'undefined' ? undefined : variableName}
                disabled={isReadOnly}
                onChange={(e: any) => {
                  const formValue = variables[variableName];
                  delete variables[variableName];
                  setValue(
                    'data.variables',
                    {
                      ...variables,
                      [e.value]: formValue,
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
              />
              <DragHandle style={{ marginInline: 16 }} />
              <div
                style={{
                  flex: 1,
                }}
              >
                <label className="input-label">Select Parameter</label>
                <div
                  style={{
                    flex: 1,
                    ...(variableName === 'undefined' && {
                      background: '#f4f4f4',
                      paddingBlock: 8,
                    }),
                  }}
                >
                  <Select
                    isDisabled={isReadOnly || variableName === 'undefined'}
                    isLoading={!!loading}
                    styles={selectStyles}
                    isSearchable={false}
                    options={parametersForCalc.map((parameter) => ({
                      value: parameter.id,
                      ...parameter,
                    }))}
                    defaultValue={
                      value?.parameterId
                        ? {
                            value: value.parameterId,
                            label: value.label,
                          }
                        : undefined
                    }
                    onChange={(option: any) => {
                      setValue(
                        'data.variables',
                        {
                          ...variables,
                          [variableName]: {
                            parameterId: option.id,
                            taskId: option.taskId,
                            label: option.label,
                          },
                        },
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
                      );
                    }}
                  />
                </div>
              </div>
              {!isReadOnly && (
                <Clear
                  style={{ marginLeft: 16, cursor: 'pointer' }}
                  onClick={() => {
                    delete variables[variableName];
                    setValue(
                      'data.variables',
                      {
                        ...variables,
                      },
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
      {!isReadOnly && (
        <Button
          type="button"
          variant="textOnly"
          style={{ padding: '8px 0', marginBlock: 16 }}
          onClick={() => {
            setValue(
              'data.variables',
              {
                ...variables,
                ['undefined']: undefined,
              },
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
          disabled={'undefined' in variables}
        >
          <Add /> Add Parameter
        </Button>
      )}
      <Textarea
        defaultValue={expression}
        name="data.expression"
        ref={register({
          required: true,
          pattern: {
            value: /^[^=]+$/,
            message: "Invalid operator '=' in the equation",
          },
        })}
        label="Write Calculation"
        rows={4}
        disabled={isReadOnly}
        error={equationError || errors?.data?.expression?.message}
      />
    </CommonWrapper>
  );
};

export default CalculationParameter;
