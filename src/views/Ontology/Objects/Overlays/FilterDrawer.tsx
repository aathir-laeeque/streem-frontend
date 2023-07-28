import { Button, FormGroup, LoadingContainer, useDrawer } from '#components';
import { conditionByParameterType } from '#PrototypeComposer/BranchingRules/RuleConfiguration';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { fetchUsers } from '#store/users/actions';
import { UsersListType } from '#store/users/types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, InputTypes, fetchDataParams } from '#utils/globalTypes';
import {
  FilterCardWrapper,
  FiltersWrapper,
} from '#views/Checklists/JobLogs/Overlays/FiltersDrawer';
import { AddCircleOutline, Close } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

const metaFilters = [
  {
    label: 'Change Done To',
    value: 'entityId',
  },
  {
    label: 'Change Done At',
    value: 'modifiedAt',
    type: MandatoryParameter.DATE_TIME,
  },
  {
    label: 'Change Done By',
    value: 'modifiedBy.id',
  },
];

enum FilterType {
  ENTITY_ID = 'entityId',
  MODIFIED_BY_ID = 'modifiedBy.id',
}

const FilterCard: FC<any> = ({ item, index, remove, form, shouldRegister, fetchData, options }) => {
  const { setValue, register, watch } = form;
  const formValues = watch('filters', []);
  const filter = formValues?.[index];
  const [state, setState] = useState<{
    selectedParameter?: any;
    selectedValue?: any;
    selectedOption: any;
  }>({
    selectedOption: {},
  });

  const {
    users: {
      all: { pageable },
    },
  } = useTypedSelector((state) => state);
  const { selectedParameter, selectedOption, selectedValue } = state;

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

    setValue(`filters.${index}.id`, item.id, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.constraint`, item?.constraint, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.key`, item?.key, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.value`, item?.value, {
      shouldValidate: true,
    });

    if (item) {
      const _selectedParameter = metaFilters.reduce((acc, currFilter) => {
        if (currFilter.value === item.key) {
          acc = currFilter;
        }
        return acc;
      }, {});

      setState((prev) => ({
        ...prev,
        selectedParameter: _selectedParameter,
        selectedValue: filter?.value,
        selectedOption: item,
      }));
    }
  }, [shouldRegister]);

  return (
    <FilterCardWrapper>
      <div className="upper-row">
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'parameterId',
                label: 'Where',
                isSearchable: false,
                placeholder: 'Select',
                options: metaFilters.map((currFilter) => ({
                  ...currFilter,
                  label: currFilter.label,
                  value: currFilter.value,
                })),
                value: selectedParameter?.label
                  ? [
                      {
                        label: selectedParameter.label,
                        value: selectedParameter.id,
                      },
                    ]
                  : null,
                style: {
                  flex: 1,
                },
                onChange: (value: any) => {
                  setValue(`filters.${index}.key`, `${value.value}`, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setState((prev) => ({
                    ...prev,
                    selectedParameter: value,
                  }));
                },
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'ruleCondition',
                label: 'Condition',
                placeholder: 'Select Condition',
                isSearchable: false,
                options: Object.entries(conditionByParameterType(selectedParameter?.type)).map(
                  ([value, label]) => ({ label, value }),
                ),
                onChange: (value: any) => {
                  setValue(`filters.${index}.constraint`, value.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setState((prev) => ({
                    ...prev,
                    selectedOption: { ...prev.selectedOption, constraint: value.value },
                  }));
                },
                value: selectedOption?.constraint
                  ? [
                      {
                        label: (conditionByParameterType(selectedParameter?.type) as any)[
                          selectedOption?.constraint
                        ],
                        value: selectedOption?.constraint,
                      },
                    ]
                  : null,
                style: {
                  width: 200,
                },
              },
            },
            ...(selectedParameter?.type === MandatoryParameter.DATE_TIME
              ? [
                  {
                    type: InputTypes.DATE_TIME,
                    props: {
                      id: 'value',
                      label: 'Value',
                      defaultValue: item?.value ? item?.value : null,
                      placeholder: 'Enter Value',
                      ref: register(`filters.${index}.value`, {
                        required: true,
                      }),
                      onChange: (value: any) => {
                        setValue(`filters.${index}.value`, parseInt(value.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setState((prev) => ({ ...prev, selectedValue: [value] }));
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
                      placeholder: 'Enter Value',
                      options: options[selectedParameter?.value],
                      value: selectedValue,
                      onChange: (value: any) => {
                        setValue(`filters.${index}.value`, value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setState((prev) => ({
                          ...prev,
                          selectedValue: [value],
                        }));
                      },

                      ...(selectedParameter?.label === 'Change Done By' && {
                        onInputChange: debounce((value) => {
                          fetchData({
                            query: value,
                          });
                        }, 500),
                        onMenuScrollToBottom: () => {
                          if (!pageable.last) {
                            fetchData({ page: pageable.page + 1 });
                          }
                        },
                      }),
                      style: {
                        flex: 1,
                      },
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

const FiltersDrawer: FC<any> = ({ setState: _setState, onApplyMoreFilters, filters }: any) => {
  const [shouldRegister, toggleShouldRegister] = useState(true);

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
    users: {
      all: { list: allUsersList },
    },
    ontology: {
      objectTypes: {
        active: { properties, relations },
      },
    },
  } = useTypedSelector((state) => state);

  let initialState = {
    [FilterType.ENTITY_ID]: [
      ...properties,
      ...relations,
      { displayName: 'Usage Status', id: 'usageStatus.new' },
    ].map((currList) => {
      return {
        label: currList.displayName,
        value: currList.id,
      };
    }),
    [FilterType.MODIFIED_BY_ID]: allUsersList.map((currList) => ({
      label: `${currList?.firstName} ${currList?.lastName}`,
      value: currList?.id,
      externalId: currList?.employeeId,
    })),
  };

  const [options, setOptions] = useState(initialState);

  useEffect(() => {
    if (allUsersList) {
      const newList = allUsersList.map((currList) => ({
        label: `${currList?.firstName} ${currList?.lastName}`,
        value: currList?.id,
        externalId: currList?.employeeId,
      }));
      setOptions((prev) => ({
        ...prev,
        [FilterType.MODIFIED_BY_ID]: newList,
      }));
    }
  }, [allUsersList]);

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

  const dispatch = useDispatch();

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

  const onAddNewFilter = () => {
    const id = uuidv4();
    append({
      id,
    });
  };

  const onRemoveFilter = (index: number) => {
    remove(index);
    toggleShouldRegister((prev) => !prev);
  };

  const fetchUsersData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, query = '' } = params;
    const filters = [{ field: 'firstName', op: FilterOperators.LIKE, values: [query] }];
    dispatch(
      fetchUsers(
        {
          page,
          size,
          archived: false,
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [...(query && filters)],
          }),
          sort: 'createdAt,desc',
        },
        UsersListType.ALL,
      ),
    );
  };

  useEffect(() => {
    setDrawerOpen(true);
    fetchUsersData();
  }, []);

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'Filters',
    hideCloseIcon: true,
    bodyContent: (
      <FiltersWrapper onSubmit={handleSubmit(onSubmit)}>
        <LoadingContainer
          loading={false}
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
                    shouldRegister={shouldRegister}
                    fetchData={fetchUsersData}
                    options={options}
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
