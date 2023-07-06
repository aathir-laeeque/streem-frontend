import { Button, FormGroup } from '#components';
import { updateParameterApi } from '#PrototypeComposer/Activity/actions';
import {
  BranchingRule,
  MandatoryParameter,
  Parameter,
  ParameterType,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Constraint } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
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
        [Constraint.GT]: 'After Date',
        [Constraint.LT]: 'Before Date',
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
  isReadOnly,
  parameter,
  hiddenParametersList,
  visibleParametersList,
  control,
}) => {
  const thenValue = useWatch<{ value: string }>({ name: `rules.${index}.thenValue`, control });
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
    isLast: true,
  });

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    if (!parameter.data.length) {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
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
            options: [
              ...prev.options,
              ...(response.data || []).map((option: any) => ({
                value: option.id,
                label: option.displayName,
                externalId: option.externalId,
              })),
            ],
            isLoading: false,
          }));
        }
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else if (!options.length) {
      setState((prev) => ({
        ...prev,
        options: parameter.data.map((i: any) => ({ label: i.name, value: i.id })),
      }));
    }
  };

  return (
    <RuleCardWrapper>
      <input
        type="hidden"
        name={`rules.${index}.id`}
        ref={control.register()}
        defaultValue={item.id}
      />
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
              remove(index);
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
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
          ]}
          style={{ flex: 'unset' }}
        />
        <Controller
          control={control}
          name={`rules.${index}.input`}
          rules={{
            required: true,
          }}
          defaultValue={item.input || null}
          render={({ onChange, value }) => {
            return (
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'input',
                      label: 'Value',
                      options: options,
                      value: options.find((o: any) => o?.value === value?.[0]),
                      isSearchable: false,
                      isDisabled: isReadOnly,
                      placeholder: 'Select Value',
                      menuPlacement: 'bottom',
                      onChange: (option: any) => {
                        onChange([option.value]);
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
            );
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Controller
          control={control}
          name={`rules.${index}.thenValue`}
          rules={{
            required: true,
          }}
          defaultValue={item.thenValue || null}
          render={({ onChange, value }) => (
            <FormGroup
              inputs={[
                {
                  type: InputTypes.SINGLE_SELECT,
                  props: {
                    id: 'thenValue',
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
                    value: [value],
                    isDisabled: isReadOnly,
                    onChange: (option: { label: string; value: string }) => {
                      onChange(option);
                    },
                    isSearchable: false,
                    placeholder: 'Select',
                    style: {
                      width: 200,
                    },
                  },
                },
              ]}
              style={{ flex: 'unset' }}
            />
          )}
        />
        {thenValue?.value === 'show' ? (
          <Controller
            control={control}
            name={`rules.${index}.show.parameters`}
            rules={{
              required: true,
            }}
            shouldUnregister={true}
            key={`rules.${index}.show.parameters`}
            defaultValue={item.show?.parameters || null}
            render={({ onChange, value, name }) => {
              const selectedParameters: any[] = [];
              hiddenParametersList.forEach((stage: any) => {
                stage.options.forEach((task: any) => {
                  task.options.forEach((p: any) => {
                    if (value?.includes(p.value)) {
                      selectedParameters.push(p);
                    }
                  });
                });
              });
              return (
                <FormGroup
                  inputs={[
                    {
                      type: InputTypes.MULTI_SELECT,
                      props: {
                        id: name,
                        name,
                        label: 'Show',
                        options: hiddenParametersList,
                        value: selectedParameters,
                        isDisabled: isReadOnly,
                        placeholder: 'Select Parameters',
                        closeMenuOnSelect: false,
                        components: { Option },
                        menuPlacement: 'bottom',
                        onChange: (value: any[]) => {
                          onChange(value.length > 0 ? value.map((v) => v.value) : null);
                        },
                        style: {
                          flex: 1,
                        },
                      },
                    },
                  ]}
                />
              );
            }}
          />
        ) : (
          <Controller
            control={control}
            name={`rules.${index}.hide.parameters`}
            rules={{
              required: true,
            }}
            shouldUnregister={true}
            key={`rules.${index}.hide.parameters`}
            defaultValue={item.hide?.parameters || null}
            render={({ onChange, value, name }) => {
              const selectedParameters: any[] = [];
              visibleParametersList.forEach((stage: any) => {
                stage.options.forEach((task: any) => {
                  task.options.forEach((p: any) => {
                    if (value?.includes(p.value)) {
                      selectedParameters.push(p);
                    }
                  });
                });
              });
              return (
                <FormGroup
                  inputs={[
                    {
                      type: InputTypes.MULTI_SELECT,
                      props: {
                        id: name,
                        name,
                        label: 'Hide',
                        value: selectedParameters,
                        options: thenValue?.value ? visibleParametersList : [],
                        isDisabled: isReadOnly,
                        placeholder: 'Select Parameters',
                        closeMenuOnSelect: false,
                        components: { Option },
                        menuPlacement: 'bottom',
                        onChange: (value: any[]) => {
                          onChange(value.length > 0 ? value.map((v) => v.value) : null);
                        },
                        style: {
                          flex: 1,
                        },
                      },
                    },
                  ]}
                />
              );
            }}
          />
        )}
      </div>
    </RuleCardWrapper>
  );
};

const RuleConfiguration: FC<{ parameter: Parameter; isReadOnly: boolean }> = ({
  parameter,
  isReadOnly,
}) => {
  const dispatch = useDispatch();
  const {
    parameters: { listById, parameterOrderInTaskInStage },
    stages: { listOrder, listById: stagesById },
    tasks: { listById: tasksById, tasksOrderInStage },
    data,
  } = useTypedSelector((state) => state.prototypeComposer);
  const jobParameters = data?.parameters ?? [];
  const [hiddenParametersList, setHiddenParametersList] = useState<any[]>([]);
  const [visibleParametersList, setVisibleParametersList] = useState<any[]>([]);
  const form = useForm<{
    rules: BranchingRule[];
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    control,
    reset,
    getValues,
    formState: { isDirty, isValid },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
    keyName: 'key',
  });

  useEffect(() => {
    const cjfHiddenListOptions: any[] = [];
    const cjfShowListOptions: any[] = [];

    if (parameter.targetEntityType === TargetEntityType.PROCESS) {
      const createJobOptionHide: any = {
        label: 'Create Job Form',
        options: [],
      };

      const createJobOptionShow: any = {
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
      if (createJobOptionHide.options.length) {
        cjfHiddenListOptions.push({
          label: '',
          value: '',
          options: [createJobOptionHide],
        });
      }

      jobParameters
        .filter((currParam) => !currParam?.hidden && currParam?.id !== parameter?.id)
        .forEach((currParameter: any) => {
          const jobParameterOption: any = {
            label: currParameter.label,
            value: currParameter.id,
          };
          createJobOptionShow.options.push(jobParameterOption);
        });

      if (createJobOptionShow.options.length) {
        cjfShowListOptions.push({
          label: '',
          value: '',
          options: [createJobOptionShow],
        });
      }

      filterParameterOptions(cjfHiddenListOptions, cjfShowListOptions);
    } else {
      filterParameterOptions();
    }
    handleReset();
  }, [parameter.id]);

  const handleReset = () => {
    reset({
      rules: (parameter?.rules || []).map((rule) => ({
        ...rule,
        thenValue: rule.hide ? { label: 'Hide', value: 'hide' } : { label: 'Show', value: 'show' },
      })),
    });
  };

  const filterParameterOptions = useCallback(
    (hiddenParams: any[] = [], shownParams: any[] = []) => {
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

      setHiddenParametersList([...hiddenParams, ...hiddenListOptions]);
      setVisibleParametersList([, ...shownParams, ...visibleListOptions]);
    },
    [parameter.id],
  );

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const data: { rules: BranchingRule[] } = getValues();
    const updatedRules = (data.rules || []).map((rule) => {
      return {
        ...rule,
        constraint: Constraint.EQ,
      };
    });
    dispatch(
      updateParameterApi({
        ...parameter,
        rules: updatedRules.map((rule) => {
          delete rule.thenValue;
          return rule;
        }),
      }),
    );
    reset({ rules: data.rules });
  };

  const onAddNewRule = () => {
    append({
      id: uuidv4(),
    });
  };

  return (
    <RuleConfigurationWrapper>
      <div className="header">
        Rules for {parameter.label}
        {!isReadOnly && (
          <div className="actions">
            <Button disabled={!isDirty} variant="secondary" color="red" onClick={handleReset}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!isDirty || !isValid}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="rule-cards">
        {fields.map((item, index) => (
          <RuleCard
            key={item.key}
            item={item}
            index={index}
            remove={remove}
            isReadOnly={isReadOnly}
            parameter={parameter}
            hiddenParametersList={hiddenParametersList}
            visibleParametersList={visibleParametersList}
            control={control}
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
