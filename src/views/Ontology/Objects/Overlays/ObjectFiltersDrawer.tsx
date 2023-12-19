import { Button, FormGroup, LoadingContainer, useDrawer } from '#components';
import { FilterOperators, InputTypes } from '#utils/globalTypes';
import {
  FilterCardWrapper,
  FiltersWrapper,
} from '#views/Checklists/JobLogs/Overlays/FiltersDrawer';
import { AddCircleOutline, Close } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { labelByConstraint } from '#utils';
import { navigate } from '@reach/router';

const FilterCard: FC<any> = ({ item, index, remove, form, shouldRegister, activeObjectType }) => {
  const { setValue, register, watch } = form;
  const formValues = watch('filters', []);
  const filter = formValues?.[index];
  const [state, setState] = useState<{
    selectedObjectProperty: any;
    selectedCondition: any;
    selectedValue: any;
  }>({});

  const { selectedObjectProperty, selectedCondition, selectedValue } = state;

  const { properties } = activeObjectType;

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
      const selectedProperty = [...(properties || [])].find(
        (objectTypeProperty) => objectTypeProperty?.id === item?.field?.split('.')[1],
      );
      setState((prev) => ({
        ...prev,
        selectedObjectProperty: selectedProperty,
        selectedCondition: item?.op,
        selectedValue: filter?.value,
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
                id: 'propertyId',
                label: 'Where',
                isSearchable: false,
                placeholder: 'Select',
                value: selectedObjectProperty
                  ? [
                      {
                        label: selectedObjectProperty.label || selectedObjectProperty.displayName,
                        value: selectedObjectProperty.value || selectedObjectProperty.id,
                      },
                    ]
                  : null,
                options: [...(properties || [])].map((objectTypeProperty) => ({
                  externalId: objectTypeProperty?.externalId,
                  label: objectTypeProperty.displayName,
                  value: objectTypeProperty.id,
                  inputType: objectTypeProperty?.inputType,
                  _options: objectTypeProperty?.options,
                })),
                style: {
                  flex: 1,
                },
                onChange: (value: any) => {
                  setValue(`filters.${index}.key`, `searchable.${value.value}`, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setState((prev) => ({ ...prev, selectedObjectProperty: value }));
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
                value: selectedCondition
                  ? [
                      {
                        label: (labelByConstraint(selectedObjectProperty?.inputType) as any)[
                          selectedCondition
                        ],
                        value: selectedCondition,
                      },
                    ]
                  : null,
                options: Object.entries(labelByConstraint(selectedObjectProperty?.inputType)).map(
                  ([value, label]) => ({ label, value }),
                ),
                onChange: (value: any) => {
                  setValue(`filters.${index}.constraint`, value.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setState((prev) => ({ ...prev, selectedCondition: value.value }));
                },
                style: {
                  flex: 1,
                },
              },
            },
            {
              type: selectedObjectProperty?.inputType
                ? selectedObjectProperty.inputType
                : InputTypes.SINGLE_SELECT,
              props: {
                id: 'value',
                label: 'Value',
                placeholder: 'Enter Value',
                isSearchable: false,
                value: selectedValue,
                options: [InputTypes.SINGLE_SELECT, InputTypes.MULTI_SELECT].includes(
                  selectedObjectProperty?.inputType,
                )
                  ? selectedObjectProperty?._options?.map((option: any) => ({
                      label: option.displayName,
                      value: option.id,
                    }))
                  : [],
                onChange: (value: any) => {
                  if (
                    [InputTypes.DATE, InputTypes.DATE_TIME, InputTypes.NUMBER].includes(
                      selectedObjectProperty?.inputType,
                    )
                  ) {
                    setValue(`filters.${index}.value`, parseInt(value.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    setValue(`filters.${index}.value`, value.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                  setState((prev) => ({ ...prev, selectedValue: value.value }));
                },
                style: {
                  flex: 1,
                },
              },
            },
          ]}
        />
        <Close className="remove-icon" onClick={() => remove(index)} />
      </div>
    </FilterCardWrapper>
  );
};

const ObjectFiltersDrawer: FC<any> = ({
  setShowFiltersDrawer,
  activeObjectType,
  onApplyFilters,
  existingFilters,
}: any) => {
  const [shouldRegister, toggleShouldRegister] = useState(true);

  const form = useForm<{
    filters: any[];
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      filters: existingFilters?.filters?.fields || [],
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

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setShowFiltersDrawer(false);
    }, 200);
  };

  const onSubmit = () => {
    const data = getValues();

    const fields = data.filters.map((filter) => ({
      field: filter.key,
      op: filter.constraint,
      values: [filter.value],
    }));

    const payload = {
      ...existingFilters,
      filters: {
        op: FilterOperators.AND,
        fields,
      },
    };
    navigate(`?filters=${JSON.stringify(payload)}`);
    onApplyFilters(payload);
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

  useEffect(() => {
    setDrawerOpen(true);
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
                    activeObjectType={activeObjectType}
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

export default ObjectFiltersDrawer;
