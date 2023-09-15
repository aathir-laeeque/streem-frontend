import { ChecklistStatesContent } from '#PrototypeComposer/checklist.types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
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

const metaFilters = [
  {
    label: 'Prototype State',
    value: 'state',
    field: 'state',
  },
  {
    label: 'I am Involved as',
    value: 'collaborator',
    field: 'collaborator',
  },
];

const metaFiltersValues = (filterType: string) => {
  switch (filterType) {
    case 'state':
      return [
        ...Object.keys(ChecklistStatesContent)
          .filter((key) => key !== 'PUBLISHED')
          .map((key) => ({
            label: ChecklistStatesContent[key as keyof typeof ChecklistStatesContent],
            value: key,
            field: 'state',
          })),
      ];
    case 'collaborator':
      return [
        { label: 'As Author', value: CollaboratorType.AUTHOR },
        { label: 'As Collaborator', value: CollaboratorType.REVIEWER },
        { label: 'Not Involved', value: 'NOT' },
      ];
    default:
      return;
  }
};

const FilterCard: FC<any> = ({ item, index, remove, form, shouldRegister }) => {
  const { setValue, register, watch } = form;
  const formValues = watch('filters', []);
  const [state, setState] = useState<{
    selectedFilter?: any;
    showStateFilter: boolean;
    showCollaboratorFilter: boolean;
  }>({
    selectedFilter: {},
    showStateFilter: !formValues?.some((item: any) => item?.field === 'state'),
    showCollaboratorFilter: !formValues?.some((item: any) =>
      ['collaborator', 'collaborators.type', 'not.a.collaborator'].includes(item?.field),
    ),
  });

  const { selectedFilter, showStateFilter, showCollaboratorFilter } = state;

  useEffect(() => {
    register(`filters.${index}.value`, {
      required: true,
    });
    register(`filters.${index}.field`, {
      required: true,
    });
    register(`filters.${index}.id`, {
      required: true,
    });
    register(`filters.${index}.op`, {
      required: true,
    });

    setValue(`filters.${index}.id`, item.id, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.op`, item?.op, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.field`, item?.field, {
      shouldValidate: true,
    });
    setValue(`filters.${index}.value`, item?.values?.[0], {
      shouldValidate: true,
    });

    if (item) {
      const _selectedFilter = metaFilters.find((currFilter) => {
        if (item.field === 'state') {
          return currFilter.value === item.field;
        } else {
          return currFilter.value === 'collaborator';
        }
      });

      setState((prev) => ({
        ...prev,
        selectedFilter: _selectedFilter?.field,
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
                id: 'prototypeFilter',
                label: 'Where',
                isSearchable: false,
                placeholder: 'Select',
                options: metaFilters
                  ?.filter((currFilter) => {
                    if (showStateFilter && showCollaboratorFilter) {
                      return true;
                    } else if (showStateFilter) {
                      return currFilter.value === 'state';
                    } else if (showCollaboratorFilter) {
                      return currFilter.value === 'collaborator';
                    }
                    return false;
                  })
                  .map((currFilter) => ({
                    ...currFilter,
                    label: currFilter.label,
                    value: currFilter.value,
                  })),
                value: item?.field
                  ? metaFilters.find((currFilter) => {
                      if (item.field === 'state') {
                        return currFilter.value === item.field;
                      } else {
                        return currFilter.value === 'collaborator';
                      }
                    })
                  : undefined,
                onChange: (value: any) => {
                  setValue(`filters.${index}.field`, value.field, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setState((prev) => ({
                    ...prev,
                    selectedFilter: value.value,
                  }));
                },
                style: {
                  flex: 1,
                },
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'prototypeCondition',
                label: 'Condition',
                placeholder: 'Select Condition',
                isSearchable: false,
                options: [
                  { label: 'Is', value: FilterOperators.EQ },
                  // { label: 'Is Not', value: FilterOperators.NE },
                ],
                value: item?.op ? [{ label: 'Is', value: FilterOperators.EQ }] : undefined,
                onChange: (value: any) => {
                  setValue(`filters.${index}.op`, value.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
                style: {
                  flex: 1,
                },
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'value',
                label: 'Value',
                placeholder: 'Enter Value',
                options: metaFiltersValues(selectedFilter),
                onChange: (value: any) => {
                  setValue(`filters.${index}.value`, value.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
                defaultValue: item?.field
                  ? item.field === 'state'
                    ? [{ label: ChecklistStatesContent[item.values?.[0]], value: item.values?.[0] }]
                    : item.values?.[0] === CollaboratorType.AUTHOR
                    ? [{ label: 'As Author', value: CollaboratorType.AUTHOR }]
                    : item.values?.[0] === CollaboratorType.REVIEWER
                    ? [{ label: 'As Collaborator', value: CollaboratorType.REVIEWER }]
                    : [{ label: 'Not Involved', value: 'NOT' }]
                  : undefined,
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
      _setState(false);
    }, 200);
  };

  const onSubmit = () => {
    const data = getValues();
    onApplyMoreFilters(data.filters);
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
                  />
                );
              })}
              <Button
                type="button"
                variant="secondary"
                style={{ marginBottom: 16, padding: '6px 8px' }}
                onClick={onAddNewFilter}
                disabled={fields.length >= 2}
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
