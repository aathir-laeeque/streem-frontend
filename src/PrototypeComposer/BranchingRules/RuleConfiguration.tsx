import { Button, FormGroup } from '#components';
import { updateParameterApi } from '#PrototypeComposer/Activity/actions';
import {
  MandatoryParameter,
  ParameterType,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { InputTypes } from '#utils/globalTypes';
import { Constraint } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { components, OptionProps } from 'react-select';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const RuleConfigurationWrapper = styled.form`
  display: flex;
  flex: 1;
  position: relative;
  flex-direction: column;
  gap: 16px;
  height: 100%;

  .header {
    display: flex;
    padding-right: 16px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 24px;
    align-items: center;
    .actions {
      display: flex;
      margin-left: auto;
    }
  }

  .rule-cards {
    overflow-y: auto;
    padding-right: 16px;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
  }
`;

const RuleCardWrapper = styled.div`
  border: 1px solid #e0e0e0;
  padding-top: 16px;

  .upper-row {
    display: flex;
    align-items: center;
    padding-right: 16px;
    .remove-icon {
      cursor: pointer;
      margin-top: 6px;
      font-size: 16px;
    }
  }

  .form-group {
    flex: 1;
    flex-direction: row;
    gap: 16px;
    padding: 0px 16px;

    > div {
      margin-bottom: 16px;
    }
  }

  .nested-optgroup {
    padding: 12px 0px 0px 24px;
    :last-of-type {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }
    .nested-optgroup-label {
      color: #333;
      margin-bottom: 4px;
    }
    .nested-optgroup-option {
      padding-left: 16px;
      > div {
        border-bottom: none;
        background-color: #fff;
        padding-block: 8px;
      }
    }
    .option {
      display: flex;
      align-items: center;
      color: hsl(0, 0%, 20%);
      cursor: pointer;

      .check-mark {
        display: inline-block;
        margin-right: 8px;
        height: 20px;
        width: 20px;
        border: 2px solid hsl(0, 0%, 50%);
        background: transparent;
        position: relative;

        &.checked {
          border: 2px solid #1d84ff;
          background: #1d84ff;

          :after {
            content: '';
            position: absolute;
            display: block;
            left: 6px;
            top: 3px;
            width: 3px;
            height: 7px;
            border: solid white;
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        }
      }
    }
  }
`;

export const conditionByParameterType = (type: ParameterType) => {
  switch (type) {
    case MandatoryParameter.DATE_TIME:
      return {
        [Constraint.GT]: 'is greater than',
        [Constraint.LT]: 'is less than',
      };
    default:
      return {
        [Constraint.EQ]: 'is equal to',
      };
  }
};

const renderNestedOption = (props: OptionProps<any>, label: string, nestedOptions: any[]) => {
  const { innerProps, selectOption, selectProps, setValue } = props;
  const selectedValues = nestedOptions.reduce((acc: any, v: any) => {
    if (selectProps.value.some((_v: any) => _v.value === v.value)) {
      acc[v.value] = true;
    }
    return acc;
  }, {});
  const isOptionsChecked = Object.keys(selectedValues).length === nestedOptions.length;
  return (
    <div className="nested-optgroup">
      <div
        className="nested-optgroup-label"
        onClick={() => {
          if (isOptionsChecked) {
            setValue(
              selectProps.value.filter(
                (v: any) => !nestedOptions.some((_v) => _v.value === v.value),
              ),
              'deselect-option',
            );
          } else {
            setValue([...selectProps.value, ...nestedOptions], 'select-option');
          }
        }}
      >
        <div className="option">
          <span className={`check-mark ${isOptionsChecked ? 'checked' : ''}`} />
          {label}
        </div>
      </div>
      {nestedOptions.map((nestedOption) => {
        if (nestedOption.options?.length) {
          return renderNestedOption(props, nestedOption.label, nestedOption.options);
        }
        const isChecked = !!selectedValues?.[nestedOption.value];
        return (
          <div className="nested-optgroup-option" key={nestedOption.value}>
            <components.Option
              {...props}
              innerProps={{
                ...innerProps,
                onClick: () => selectOption(nestedOption),
              }}
            >
              <div className="option">
                <span className={`check-mark ${isChecked ? 'checked' : ''}`} />
                {nestedOption.label}
              </div>
            </components.Option>
          </div>
        );
      })}
    </div>
  );
};

const Option = (props: OptionProps<any>) => {
  const { data } = props;
  const nestedOptions = data.options;

  if (nestedOptions) {
    const label = data.label;
    return renderNestedOption(props, label, nestedOptions);
  }
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const RuleCard: FC<any> = ({
  item,
  index,
  remove,
  form,
  isReadOnly,
  parameter,
  parametersList,
  shouldRegister,
}) => {
  const { setValue, register, watch } = form;
  const formValues = watch('rules', []);
  const rules = formValues?.[index];

  useEffect(() => {
    register(`rules.${index}.input`, {
      required: true,
    });
    register(`rules.${index}.hide.parameters`, {
      required: true,
    });
    register(`rules.${index}.id`, {
      required: true,
    });
    register(`rules.${index}.constraint`, {
      required: true,
    });
    register(`rules.${index}.hide.stages`, {
      required: true,
    });
    register(`rules.${index}.hide.tasks`, {
      required: true,
    });

    setValue(`rules.${index}.id`, item.id, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.constraint`, Constraint.EQ, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.hide.tasks`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.hide.stages`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.hide.parameters`, item?.hide?.parameters, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.input`, item?.input, {
      shouldValidate: true,
    });
  }, [shouldRegister]);

  const _selectedValue = parameter.data.find((o: any) => o.id === rules?.input);
  const selectedValue = _selectedValue
    ? [
        {
          label: _selectedValue.name,
          value: _selectedValue.id,
        },
      ]
    : undefined;
  const selectedParameters: any[] = [];
  parametersList.forEach((stage: any) => {
    stage.options.forEach((task: any) => {
      task.options.forEach((p: any) => {
        if (rules?.hide?.parameters?.includes(p.value)) {
          selectedParameters.push(p);
        }
      });
    });
  });

  return (
    <RuleCardWrapper>
      <div className="upper-row">
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'parameterId',
                label: 'IF',
                options: [],
                value: [
                  {
                    label: parameter.label,
                    value: parameter.id,
                  },
                ],
                isSearchable: false,
                isDisabled: true,
                placeholder: 'Select Parameter',
                style: {
                  flex: 1,
                },
              },
            },
          ]}
        />
        {!isReadOnly && <Close className="remove-icon" onClick={() => remove(index)} />}
      </div>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'ruleCondition',
              label: 'Condition',
              options: Object.entries(conditionByParameterType(parameter.type)).map(
                ([value, label]) => ({ label, value }),
              ),
              value: [
                {
                  label: 'is equal to',
                  value: Constraint.EQ,
                },
              ],
              isSearchable: false,
              isDisabled: true,
              placeholder: 'Select Condition',
              style: {
                width: 200,
              },
            },
          },
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'value',
              label: 'Value',
              options: parameter.data.map((i: any) => ({ label: i.name, value: i.id })),
              value: selectedValue,
              isSearchable: false,
              isDisabled: isReadOnly,
              placeholder: 'Select Value',
              onChange: (value: any) => {
                setValue(`rules.${index}.input`, value.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
              style: {
                flex: 1,
              },
            },
          },
        ]}
      />
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'then',
              label: 'Then',
              options: [],
              value: [
                {
                  label: 'Hide',
                  value: 'hide',
                },
              ],
              isSearchable: false,
              isDisabled: true,
              placeholder: 'Select',
              style: {
                width: 200,
              },
            },
          },
          {
            type: InputTypes.MULTI_SELECT,
            props: {
              id: 'parameters',
              label: 'Hide',
              options: parametersList,
              value: selectedParameters,
              isDisabled: isReadOnly,
              placeholder: 'Select Parameters',
              closeMenuOnSelect: false,
              components: { Option },
              onChange: (value: any[]) => {
                setValue(
                  `rules.${index}.hide.parameters`,
                  value.length ? value.map((v) => v.value) : null,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              },
              style: {
                flex: 1,
              },
            },
          },
        ]}
      />
    </RuleCardWrapper>
  );
};

const RuleConfiguration: FC<{ parameter: any; isReadOnly: boolean }> = ({
  parameter,
  isReadOnly,
}) => {
  const [parametersList, setParametersList] = useState<any[]>([]);
  const [shouldRegister, toggleShouldRegister] = useState(true);
  const {
    parameters: { listById, parameterOrderInTaskInStage },
    stages: { listOrder, listById: stagesById },
    tasks: { listById: tasksById, tasksOrderInStage },
    data: { parameters: jobParameters },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();
  const form = useForm<{
    rules: any[];
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      rules: parameter?.rules || [],
    },
  });

  const { control, formState, handleSubmit, reset } = form;
  const { isDirty, isValid } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  useEffect(() => {
    const listOptions: any[] = [];
    if (parameter.targetEntityType === TargetEntityType.PROCESS) {
      const createJobOption = {
        label: 'Create Job Form',
        options: [],
      };
      jobParameters.forEach((currParameter: any) => {
        const jobParameterOption: any = {
          label: currParameter.label,
          value: currParameter.id,
        };
        createJobOption.options.push(jobParameterOption);
      });
      listOptions.push({
        label: '',
        value: '',
        options: [createJobOption],
      });
    } else {
      listOrder.forEach((stageId, stageIndex) => {
        const stage = stagesById[stageId];
        const stageNumber = stageIndex + 1;
        const stageOption: any = {
          label: `Stage ${stageNumber} : ${stage.name}`,
          value: stage.id,
          options: [],
        };
        tasksOrderInStage[stageId].forEach((taskId, taskIndex) => {
          const task = tasksById[taskId];
          const taskOption: any = {
            label: `Task ${stageNumber}.${taskIndex + 1} : ${task.name}`,
            value: task.id,
            options: [],
          };
          parameterOrderInTaskInStage[stageId][taskId].forEach((parameterId) => {
            if (parameterId !== parameter.id) {
              const p = listById[parameterId];
              taskOption.options.push({
                label: p.label,
                value: p.id,
              });
            }
          });
          if (taskOption.options.length) {
            stageOption.options.push(taskOption);
          }
        });
        listOptions.push(stageOption);
      });
    }
    setParametersList(listOptions);
    reset({
      rules: parameter?.rules || [],
    });
    toggleShouldRegister((prev) => !prev);
  }, [parameter.id]);

  const onSubmit = (data: any) => {
    reset({
      rules: data?.rules || [],
    });
    toggleShouldRegister((prev) => !prev);
    dispatch(
      updateParameterApi({
        ...parameter,
        ...(data?.rules
          ? data
          : {
              rules: [],
            }),
      }),
    );
  };

  const onAddNewRule = () => {
    const id = uuidv4();
    const constraint = Constraint.EQ;
    const stages: string[] = [];
    const tasks: string[] = [];
    append({
      id,
      constraint,
      hide: {
        stages,
        tasks,
      },
    });
  };

  const onRemoveRule = (index: number) => {
    remove(index);
    toggleShouldRegister((prev) => !prev);
  };

  return (
    <RuleConfigurationWrapper onSubmit={handleSubmit(onSubmit)}>
      <div className="header">
        Rules for {parameter.label}
        {!isReadOnly && (
          <div className="actions">
            <Button
              disabled={!isDirty}
              variant="secondary"
              color="red"
              onClick={() => {
                reset();
                toggleShouldRegister((prev) => !prev);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || !isValid}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="rule-cards">
        {fields.map((item, index) => (
          <RuleCard
            key={item.id}
            item={item}
            index={index}
            form={form}
            remove={onRemoveRule}
            isReadOnly={isReadOnly}
            parameter={parameter}
            parametersList={parametersList}
            shouldRegister={shouldRegister}
          />
        ))}
        {!isReadOnly && (
          <Button
            type="button"
            variant="secondary"
            style={{ marginBottom: 16, padding: '6px 8px' }}
            onClick={onAddNewRule}
          >
            <AddCircleOutline style={{ marginRight: 8 }} /> Add
          </Button>
        )}
      </div>
    </RuleConfigurationWrapper>
  );
};

export default RuleConfiguration;
