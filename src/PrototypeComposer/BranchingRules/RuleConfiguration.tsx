import { Button, FormGroup } from '#components';
import { updateParameterApi } from '#PrototypeComposer/Activity/actions';
import {
  MandatoryParameter,
  ParameterType,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Constraint } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import _ from 'lodash';
import React, { FC, useEffect, useState, useRef } from 'react';
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
        [Constraint.NE]: 'is not equal to',
      };
  }
};

const renderNestedOption = (props: OptionProps<any>, label: string, nestedOptions: any[]) => {
  const { innerProps, selectOption, selectProps, setValue } = props;
  const selectedValues = nestedOptions.reduce((acc: any, v: any) => {
    if (selectProps.value?.some((_v: any) => _v.value === v.value)) {
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
                (v: any) => !nestedOptions?.some((_v) => _v.value === v.value),
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
      {nestedOptions?.map((nestedOption) => {
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
  hiddenParametersList,
  visibleParametersList,
  shouldRegister,
  compareValues,
  setHasChanged,
}) => {
  const { setValue, register, watch } = form;
  const formValues = watch('rules', []);
  const rules = formValues?.[index];

  const [state, setState] = useState<{
    isLoading: Boolean;
    options: any[];
  }>({
    isLoading: false,
    options: [],
  });
  const { options, isLoading } = state;
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  const toShow = rules?.thenValue?.value === 'show';
  const selectedThenValue = rules?.thenValue;

  const defaultThenValue = parameter.rules?.[index]?.['hide']
    ? {
        label: 'Hide',
        value: 'hide',
      }
    : parameter.rules?.[index]?.['show']
    ? {
        label: 'Show',
        value: 'show',
      }
    : null;

  useEffect(() => {
    register(`rules.${index}.input`, {
      required: true,
    });
    register(`rules.${index}.thenValue`, {
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
    register(`rules.${index}.show.stages`, {
      required: true,
    });
    register(`rules.${index}.show.tasks`, {
      required: true,
    });

    setValue(`rules.${index}.show.tasks`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.show.stages`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.hide.tasks`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.hide.stages`, [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.id`, item.id, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.thenValue`, rules?.thenValue || defaultThenValue, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.constraint`, Constraint.EQ, {
      shouldValidate: true,
    });
    setValue(`rules.${index}.input`, item?.input, {
      shouldValidate: true,
    });
  }, [shouldRegister]);

  useEffect(() => {
    register(`rules.${index}.show.parameters`, {
      required: true,
      validate: validateShow,
    });
    register(`rules.${index}.hide.parameters`, {
      required: true,
      validate: validateHide,
    });
    setValue(`rules.${index}.hide.parameters`, item?.hide?.parameters || [], {
      shouldValidate: true,
    });
    setValue(`rules.${index}.show.parameters`, item?.show?.parameters || [], {
      shouldValidate: true,
    });
  }, [rules?.thenValue]);

  const validateHide = (value) => {
    if (rules?.thenValue?.value === 'hide') {
      return value?.length > 0;
    }
    return true;
  };
  const validateShow = (value) => {
    if (rules?.thenValue?.value === 'show') {
      return value?.length > 0;
    }
    return true;
  };
  const selectedValue = () => {
    let _selectedValue;
    if (parameter.type === MandatoryParameter.SINGLE_SELECT && Array.isArray(rules?.input)) {
      _selectedValue = parameter?.data?.find((o: any) => o?.id === rules?.input?.[0]);
      return [
        {
          label: _selectedValue?.name,
          value: _selectedValue?.id,
        },
      ];
    } else if (parameter.type === MandatoryParameter.RESOURCE && Array.isArray(rules?.input)) {
      _selectedValue = options.find((o: any) => o?.id === rules?.input?.[0]);
      return {
        value: _selectedValue?.id,
        label: _selectedValue?.displayName,
        externalId: _selectedValue?.externalId,
      };
    }
  };
  const selectedParameters: any[] = [];
  (selectedThenValue
    ? selectedThenValue?.value === 'hide'
      ? visibleParametersList
      : hiddenParametersList
    : parametersList
  ).forEach((stage: any) => {
    stage.options.forEach((task: any) => {
      task.options.forEach((p: any) => {
        if (rules?.[rules?.thenValue?.value]?.parameters?.includes(p.value)) {
          selectedParameters.push(p);
        }
      });
    });
  });

  const inputByParameterType = (type: ParameterType) => {
    switch (type) {
      default:
        return InputTypes.SINGLE_SELECT;
    }
  };

  const optionsByParameterType = (type: ParameterType) => {
    switch (type) {
      case MandatoryParameter.RESOURCE:
        return options?.map((option) => ({
          value: option,
          label: option.displayName,
          externalId: option.externalId,
        }));
      default:
        return parameter.data.map((i: any) => ({ label: i.name, value: i.id }));
    }
  };

  const getOptions = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response: ResponseObj<any> = await request(
        'GET',
        `${baseUrl}${parameter.data.urlPath}&page=${pagination.current.current + 1}`,
      );
      if (response.data) {
        if (response.pageable) {
          pagination.current = {
            current: response.pageable?.page,
            isLast: response.pageable?.last,
          };
        }
        setState((prev) => ({
          ...prev,
          options: [...prev.options, ...response.data],
          isLoading: false,
        }));
      }
    } catch (e) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (!parameter.data.length) {
      getOptions();
    }
  }, []);

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
                menuPlacement: 'bottom',
                placeholder: 'Select Parameter',
                style: {
                  flex: 1,
                },
              },
            },
          ]}
        />
        {!isReadOnly && (
          <Close
            className="remove-icon"
            onClick={() => {
              setHasChanged(true);
              remove(index);
            }}
          />
        )}
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
            type: inputByParameterType(parameter.type),
            props: {
              id: 'value',
              label: 'Value',
              options: optionsByParameterType(parameter.type),
              value: selectedValue(),
              isSearchable: false,
              isDisabled: isReadOnly,
              placeholder: 'Select Value',
              menuPlacement: 'bottom',
              onChange: (value: any) => {
                setValue(
                  `rules.${index}.input`,
                  parameter.type === MandatoryParameter.RESOURCE ? [value.value.id] : [value.value],
                );
                compareValues();
              },
              onMenuScrollToBottom: () => {
                if (!isLoading && !pagination.current.isLast) {
                  getOptions();
                }
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
              options: [
                {
                  label: 'Show',
                  value: 'show',
                },
                {
                  label: 'Hide',
                  value: 'hide',
                },
              ],
              value: [selectedThenValue],
              isDisabled: isReadOnly,
              onChange: (option: { label: string; value: string }) => {
                setValue(`rules.${index}.thenValue`, option);
                compareValues();
              },
              isSearchable: false,
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
              label: rules?.thenValue?.label || 'Hide',
              options: selectedThenValue
                ? selectedThenValue?.value === 'hide'
                  ? visibleParametersList
                  : hiddenParametersList
                : parametersList,
              value: selectedParameters,
              isDisabled: isReadOnly,
              placeholder: 'Select Parameters',
              closeMenuOnSelect: false,
              components: { Option },
              menuPlacement: 'bottom',
              onChange: (value: any[]) => {
                setValue(
                  `rules.${index}.${toShow ? 'show' : 'hide'}.parameters`,
                  value.length > 0 ? value.map((v) => v.value) : null,
                );
                compareValues();
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
  const [hiddenParametersList, setHiddenParametersList] = useState<any[]>([]);
  const [visibleParametersList, setVisibleParametersList] = useState<any[]>([]);
  const [shouldRegister, toggleShouldRegister] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<{ rules: any[] }>({ rules: [] });
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

  const { control, reset, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  useEffect(() => {
    const values = getValues();
    setInitialFormValues(values);
  }, []);

  useEffect(() => {
    const cjfHiddenListOptions: any[] = [];
    const cjfShowListOptions: any[] = [];
    if (parameter.targetEntityType === TargetEntityType.PROCESS) {
      const createJobOptionHide = {
        label: 'Create Job Form',
        options: [],
      };

      const createJobOptionShow = {
        label: 'Create Job Form',
        options: [],
      };

      jobParameters
        .filter((currParam) => currParam?.hidden && currParam?.id !== parameter?.id)
        .forEach((currParameter: any) => {
          const jobParameterOption: any = {
            label: currParameter.label,
            value: currParameter.id,
          };
          createJobOptionHide.options.push(jobParameterOption);
        });
      cjfHiddenListOptions.push({
        label: '',
        value: '',
        options: [createJobOptionHide],
      });

      jobParameters
        .filter((currParam) => !currParam?.hidden && currParam?.id !== parameter?.id)
        .forEach((currParameter: any) => {
          const jobParameterOption: any = {
            label: currParameter.label,
            value: currParameter.id,
          };
          createJobOptionShow.options.push(jobParameterOption);
        });
      cjfShowListOptions.push({
        label: '',
        value: '',
        options: [createJobOptionShow],
      });

      filterParameterOptions(cjfHiddenListOptions, cjfShowListOptions);
    } else {
      filterParameterOptions();
    }

    reset({
      rules: parameter?.rules || [],
    });

    // reset()
  }, [parameter.id]);

  const filterParameterOptions = (hiddenParams: any[] = [], shownParams: any[] = []) => {
    const listOptions: any[] = [];
    const hiddenListOptions: any[] = [];
    const visibleListOptions: any[] = [];
    listOrder.forEach((stageId, stageIndex) => {
      const stage = stagesById[stageId];
      const stageNumber = stageIndex + 1;
      const stageOption: any = {
        label: `Stage ${stageNumber} : ${stage?.name}`,
        value: stage.id,
        options: [],
      };
      const hiddenStageOption: any = {
        label: `Stage ${stageNumber} : ${stage?.name}`,
        value: stage.id,
        options: [],
      };
      const visibleStageOption: any = {
        label: `Stage ${stageNumber} : ${stage?.name}`,
        value: stage.id,
        options: [],
      };
      tasksOrderInStage[stageId].forEach((taskId, taskIndex) => {
        const task = tasksById[taskId];
        const taskOption: any = {
          label: `Task ${stageNumber}.${taskIndex + 1} : ${task?.name}`,
          value: task.id,
          options: [],
        };
        const hiddenTaskOption: any = {
          label: `Task ${stageNumber}.${taskIndex + 1} : ${task?.name}`,
          value: task.id,
          options: [],
        };
        const visibleTaskOption: any = {
          label: `Task ${stageNumber}.${taskIndex + 1} : ${task?.name}`,
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
            if (p.hidden) {
              hiddenTaskOption.options.push({
                label: p.label,
                value: p.id,
              });
            } else {
              visibleTaskOption.options.push({
                label: p.label,
                value: p.id,
              });
            }
          }
        });
        if (taskOption.options.length) {
          stageOption.options.push(taskOption);
        }
        if (hiddenTaskOption.options.length) {
          hiddenStageOption.options.push(hiddenTaskOption);
        }
        if (visibleTaskOption.options.length) {
          visibleStageOption.options.push(visibleTaskOption);
        }
      });
      listOptions.push(stageOption);
      hiddenListOptions.push(hiddenStageOption);
      visibleListOptions.push(visibleStageOption);
    });

    setParametersList(listOptions);
    setHiddenParametersList([...hiddenParams, ...hiddenListOptions]);
    setVisibleParametersList([, ...shownParams, ...visibleListOptions]);
    toggleShouldRegister((prev) => !prev);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = getValues();
    const newRules = data.rules?.map((rule: any) => {
      const newRule = { ...rule };
      newRule?.thenValue?.value === 'show' ? delete newRule.hide : delete newRule.show;
      delete newRule?.thenValue;
      return newRule;
    });

    const newData = { ...data, rules: newRules };

    dispatch(
      updateParameterApi({
        ...parameter,
        ...(newData?.rules
          ? newData
          : {
              rules: [],
            }),
      }),
    );
    setHasChanged(false);
    const values = getValues();
    setInitialFormValues(values);
  };

  const compareValues = () => {
    const values = getValues();
    const formattedValues = {
      rules: values.rules.map((value) => {
        const updatedValue = {
          ...value,
        };
        if (value?.hide?.parameters?.length) {
          updatedValue.hide = {
            ...value.hide,
            parameters: value.hide.parameters.sort(),
          };
        } else {
          updatedValue.show = {
            ...value.show,
            parameters: value.show.parameters.sort(),
          };
        }

        return updatedValue;
      }),
    };
    const isDirty = !_.isEqual(initialFormValues, formattedValues);
    setHasChanged(isDirty);
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
    <RuleConfigurationWrapper>
      <div className="header">
        Rules for {parameter.label}
        {!isReadOnly && (
          <div className="actions">
            <Button
              disabled={!hasChanged}
              variant="secondary"
              color="red"
              onClick={() => {
                reset();
                toggleShouldRegister((prev) => !prev);
                setHasChanged(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!hasChanged} onClick={onSubmit}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="rule-cards">
        {fields?.map((item, index) => (
          <RuleCard
            key={item.id}
            item={item}
            index={index}
            form={form}
            remove={onRemoveRule}
            isReadOnly={isReadOnly}
            parameter={parameter}
            parametersList={parametersList}
            hiddenParametersList={hiddenParametersList}
            visibleParametersList={visibleParametersList}
            shouldRegister={shouldRegister}
            compareValues={compareValues}
            setHasChanged={setHasChanged}
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
