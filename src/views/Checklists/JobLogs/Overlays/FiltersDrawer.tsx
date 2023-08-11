import { Button, FormGroup, LoadingContainer, useDrawer } from '#components';
import { conditionByParameterType } from '#PrototypeComposer/BranchingRules/RuleConfiguration';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { apiGetParameters, baseUrl } from '#utils/apiUrls';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { Constraint } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { camelCase, startCase } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

export const FiltersWrapper = styled.form`
  display: flex;
  flex: 1;
  position: relative;
  flex-direction: column;
  padding-top: 16px;

  .form-group {
    padding: 0;
    margin-bottom: 24px;

    :last-of-type {
      margin-bottom: 0;
    }
  }

  .filter-cards {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
  }
`;

export const FilterCardWrapper = styled.div`
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
`;

const metaFilters = [
  {
    label: 'Job Started At',
    value: 'startedAt',
    type: MandatoryParameter.DATE_TIME,
  },
  {
    label: 'Job Created At',
    value: 'createdAt',
    type: MandatoryParameter.DATE_TIME,
  },
  {
    label: 'Job Ended At',
    value: 'endedAt',
    type: MandatoryParameter.DATE_TIME,
  },
  {
    label: 'Job State',
    value: 'state',
    type: MandatoryParameter.SINGLE_SELECT,
    data: Object.keys(JobStateEnum).map((key) => ({
      name: startCase(camelCase(key)),
      id: key,
    })),
  },
];

const FilterCard: FC<any> = ({
  item,
  index,
  remove,
  form,
  parameterList,
  shouldRegister,
  styles = {},
}) => {
  const { setValue, register, watch } = form;
  const formValues = watch('filters', []);
  const filter = formValues?.[index];
  const [state, setState] = useState<{
    valueOptionsLoading: boolean;
    valueOptions: any[];
    selectedParameter?: any;
    selectedValue?: any;
  }>({
    valueOptionsLoading: false,
    valueOptions: [],
  });
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  const { selectedParameter, valueOptions, valueOptionsLoading, selectedValue } = state;

  useEffect(() => {
    register(`filters.${index}.value`, {
      required: true,
    });
    register(`filters.${index}.key`, {
      required: true,
    });
    register(`filters.${index}.id`, {
      required: true,
    });
    register(`filters.${index}.constraint`, {
      required: true,
    });
    register(`filters.${index}.displayName`);

    setValue(`filters.${index}.id`, item.id, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.constraint`, item.constraint, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.key`, item?.key, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.value`, item?.value, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.displayName`, item?.displayName);

    if (item?.key || item?.value) {
      let _selectedParameter: any = undefined;
      const selectedParameterId = item.key.split('.')?.[1] || item.key.split('.')?.[0] || undefined;
      if (selectedParameterId) {
        _selectedParameter = [...metaFilters, ...parameterList].find(
          (p: any) => p.id === selectedParameterId || p.value === selectedParameterId,
        );
      }
      setState((prev) => ({
        ...prev,
        selectedParameter: _selectedParameter,
      }));
    }
  }, [shouldRegister]);

  useEffect(() => {
    if (selectedParameter) {
      if (selectedParameter.type === MandatoryParameter.DATE_TIME) {
      } else if (selectedParameter.type === MandatoryParameter.SINGLE_SELECT) {
        const _valueOptions = selectedParameter.data.map((i: any) => ({
          label: i.name,
          value: i.id,
        }));
        const _selectedValue = _valueOptions.find((o: any) => o.value === filter?.value);
        setState((prev) => ({
          ...prev,
          valueOptions: _valueOptions,
          selectedValue: _selectedValue ? [_selectedValue] : prev.selectedValue,
        }));
      } else {
        getOptions();
      }
    }
  }, [selectedParameter]);

  const getOptions = async () => {
    if (selectedParameter.type === MandatoryParameter.RESOURCE) {
      setState((prev) => ({
        ...prev,
        valueOptionsLoading: true,
        valueOptions: pagination.current?.current === -1 ? [] : prev.valueOptions,
      }));
      try {
        const response: ResponseObj<any> = await request(
          'GET',
          `${baseUrl}${selectedParameter.data.urlPath}&page=${pagination.current.current + 1}`,
        );
        if (response.data) {
          if (response.pageable) {
            pagination.current = {
              current: response.pageable?.page,
              isLast: response.pageable?.last,
            };
          }
          const optionsToSet = response.data.map((o: any) => ({
            value: o.id,
            label: o.displayName,
            externalId: o.externalId,
          }));
          const _selectedValue = optionsToSet.find((o: any) => o.value === filter?.value);
          setState((prev) => ({
            ...prev,
            valueOptions: [...prev.valueOptions, ...optionsToSet],
            valueOptionsLoading: false,
            selectedValue: _selectedValue ? [_selectedValue] : prev.selectedValue,
          }));
        }
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  return (
    <FilterCardWrapper style={styles}>
      <div className="upper-row">
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'parameterId',
                label: 'Where',
                options: [...metaFilters, ...parameterList].map((parameter: any) => ({
                  label: parameter.label,
                  value: parameter.id,
                  ...parameter,
                })),
                value: selectedParameter
                  ? [
                      {
                        label: selectedParameter.label,
                        value: selectedParameter.id,
                      },
                    ]
                  : undefined,
                isSearchable: false,
                placeholder: 'Select',
                onChange: (value: any) => {
                  pagination.current = {
                    current: -1,
                    isLast: false,
                  };
                  if (metaFilters.some((currFilter) => currFilter.value === value.value)) {
                    setValue(`filters.${index}.key`, `${value.value}`, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    if (
                      value.type === MandatoryParameter.SINGLE_SELECT ||
                      value.type === MandatoryParameter.RESOURCE
                    ) {
                      setValue(`filters.${index}.key`, `parameterValues.${value.value}`, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    } else {
                      setValue(`filters.${index}.key`, `${value.value}`, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }
                  setValue(`filters.${index}.displayName`, `${value.label}`);
                  setState((prev) => ({ ...prev, selectedParameter: value }));
                },
                style: {
                  flex: 1,
                },
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'ruleCondition',
                label: 'Condition',
                options: Object.entries(conditionByParameterType(selectedParameter?.type)).map(
                  ([value, label]) => ({ label, value }),
                ),
                isSearchable: false,
                placeholder: 'Select Condition',
                style: {
                  width: 200,
                },
                ...(selectedParameter?.type === MandatoryParameter.SINGLE_SELECT
                  ? {
                      value: [
                        {
                          label: 'is equal to',
                          value: Constraint.EQ,
                        },
                      ],
                      isDisabled: true,
                    }
                  : {
                      onChange: (value: any) => {
                        setValue(`filters.${index}.constraint`, value.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      },
                      value: filter?.constraint
                        ? [
                            {
                              label: (conditionByParameterType(selectedParameter?.type) as any)[
                                filter.constraint
                              ],
                              value: filter.constraint,
                            },
                          ]
                        : undefined,
                    }),
              },
            },
            ...(selectedParameter?.type === MandatoryParameter.DATE_TIME
              ? [
                  {
                    type: InputTypes.DATE_TIME,
                    props: {
                      id: 'value',
                      label: 'Value',
                      defaultValue: item?.value,
                      placeholder: 'Enter Value',
                      ref: register(`filters.${index}.value`, {
                        required: true,
                      }),
                      onChange: ({ value }: any) => {
                        setValue(`filters.${index}.value`, parseInt(value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      },
                      style: {
                        flex: 1,
                      },
                    },
                  },
                ]
              : [
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'value',
                      label: 'Value',
                      options: valueOptions,
                      value: selectedValue,
                      isSearchable: false,
                      placeholder: 'Select Value',
                      onChange: (value: any) => {
                        setValue(`filters.${index}.value`, value.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setState((prev) => ({ ...prev, selectedValue: [value] }));
                      },
                      style: {
                        flex: 1,
                      },
                      ...(selectedParameter?.type === MandatoryParameter.RESOURCE && {
                        onMenuScrollToBottom: () => {
                          if (!valueOptionsLoading && !pagination.current.isLast) {
                            getOptions();
                          }
                        },
                      }),
                    },
                  },
                ]),
          ]}
        />
        <Close className="remove-icon" onClick={() => remove(index)} />
      </div>
    </FilterCardWrapper>
  );
};

const FiltersDrawer: FC<any> = ({
  setState: _setState,
  checklistId,
  onApplyMoreFilters,
  filters,
}: any) => {
  const [state, setState] = useState<{
    loading: boolean;
    parameterList: any[];
  }>({
    parameterList: [],
    loading: false,
  });
  const [shouldRegister, toggleShouldRegister] = useState(true);
  const { parameterList, loading } = state;
  const form = useForm<{
    filters: any[];
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      filters,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
    control,
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters',
  });

  // console.log('errors', errors);
  // console.log('getValues', getValues());
  // console.log('isDirty, isValid', isDirty, isValid);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      _setState((prev: any) => ({ ...prev, showDrawer: false }));
    }, 200);
  };

  const onSubmit = () => {
    const data = getValues();
    onApplyMoreFilters(data.filters || []);
    handleCloseDrawer();
  };

  useEffect(() => {
    if (checklistId) {
      fetchParameter();
    }
    setDrawerOpen(true);
  }, [checklistId]);

  const fetchParameter = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const parametersForCalc = await request('GET', apiGetParameters(checklistId), {
      params: {
        filters: {
          op: FilterOperators.AND,
          fields: [
            { field: 'archived', op: FilterOperators.EQ, values: [false] },
            {
              field: 'type',
              op: FilterOperators.ANY,
              values: [MandatoryParameter.RESOURCE, MandatoryParameter.SINGLE_SELECT],
            },
          ],
        },
      },
    });
    setState((prev) => ({ ...prev, parameterList: parametersForCalc.data, loading: false }));
  };

  const onAddNewFilter = () => {
    const id = uuidv4();
    const constraint = Constraint.EQ;
    append({
      id,
      constraint,
    });
  };

  const onRemoveFilter = (index: number) => {
    remove(index);
    toggleShouldRegister((prev) => !prev);
  };

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'More Filters',
    hideCloseIcon: true,
    bodyContent: (
      <FiltersWrapper onSubmit={handleSubmit(onSubmit)}>
        <LoadingContainer
          loading={loading}
          component={
            <div className="filter-cards">
              {fields.map((item, index) => {
                return (
                  <FilterCard
                    key={item.id}
                    item={item}
                    index={index}
                    form={form}
                    remove={onRemoveFilter}
                    parameterList={parameterList}
                    shouldRegister={shouldRegister}
                    styles={item?.key === 'checklistId' ? { display: 'none' } : {}}
                  />
                );
              })}
              <Button
                type="button"
                variant="secondary"
                style={{ marginBottom: 16, padding: '6px 8px' }}
                onClick={onAddNewFilter}
              >
                <AddCircleOutline style={{ marginRight: 8 }} /> Add Filter
              </Button>
            </div>
          }
        />
      </FiltersWrapper>
    ),
    footerContent: (
      <>
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || !isValid} onClick={onSubmit}>
          Apply
        </Button>
      </>
    ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return StyledDrawer;
};

export default FiltersDrawer;
