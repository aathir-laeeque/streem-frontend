import { Button, FormGroup, ToggleSwitch, useDrawer } from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { InputTypes } from '#utils/globalTypes';
import {
  createObjectTypeRelation,
  editObjectTypeRelation,
  fetchObjectTypes,
} from '#views/Ontology/actions';
import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const AddPropertyDrawerWrapper = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  .custom-label {
    align-items: center;
    color: #525252;
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
    letter-spacing: 0.32px;
    line-height: 1.33;
    margin: 0px;
    margin-bottom: 8px;
  }
  .form-group {
    padding: 0;
    margin-bottom: 16px;
    :last-of-type {
      margin-bottom: 0;
    }
  }
  .due-after-section {
    display: flex;
    margin-bottom: 16px;
    .form-group {
      flex-direction: row;
      gap: 0.8%;
      width: 100%;
      > div {
        margin-bottom: 0;
        width: 16%;
        input {
          width: calc(100% - 32px);
        }
      }
    }
  }
  .custom-recurrence-section {
    display: flex;
    margin-top: 16px;
    .form-group {
      flex-direction: row;
      gap: 0.8%;
      width: 100%;
      > div {
        margin-bottom: 0;
        flex: 1;
      }
    }
    .week-day-container {
      display: flex;
      .week-day {
        background-color: #f4f4f4;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 16px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .scheduler-summary {
    margin-top: 16px;
    border-top: 1.5px solid #e0e0e0;
    h4 {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.14;
      letter-spacing: 0.16px;
      color: #161616;
      margin-block: 16px;
    }
    .read-only-group {
      padding: 0;
      .read-only {
        margin-bottom: 16px;
      }
    }
  }
`;

const AddRelationDrawer: FC<{
  onCloseDrawer: React.Dispatch<React.SetStateAction<boolean | string>>;
  label: string | boolean;
  relation: any;
  setSelectedRelation: React.Dispatch<React.SetStateAction<any>>;
  setShouldToggle: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onCloseDrawer, relation, label, setSelectedRelation, setShouldToggle }) => {
  const dispatch = useDispatch();
  const {
    ontology: {
      objectTypes: { list, listLoading, pageable, active },
    },
  } = useTypedSelector((state) => state);

  const form = useForm<{
    mandatory: boolean;
    displayName: string;
    description: string;
    cardinality: any;
    objectType: string;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { mandatory: true },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
    getValues,
    reset,
  } = form;

  register('mandatory');
  register('cardinality', {
    required: true,
  });
  register('objectType', {
    required: true,
  });

  const { mandatory, displayName, cardinality, objectType } = watch([
    'mandatory',
    'displayName',
    'cardinality',
    'objectType',
  ]);

  const fetchData = (page: number) => {
    dispatch(
      fetchObjectTypes(
        {
          page,
          size: DEFAULT_PAGE_SIZE,
          usageStatus: 1,
        },
        true,
      ),
    );
  };

  const handleMenuScrollToBottom = () => {
    if (!listLoading && !pageable.last) {
      fetchData(pageable.page + 1);
    }
  };

  // useEffect(() => {
  //   fetchData(0);
  // }, []);

  const basicInformation = () => {
    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <FormGroup
          style={{ marginBottom: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'objectType',
                label: 'Object Type',
                options: list
                  ?.filter((currType) => currType?.id !== active?.id)
                  ?.map((currType) => ({
                    ...currType,
                    label: currType.displayName,
                    value: currType.externalId,
                  })),
                isDisabled: label === 'Edit',
                onMenuScrollToBottom: handleMenuScrollToBottom,
                isSearchable: false,
                placeholder: 'Select Object Type',
                defaultValue: relation?.objectTypeId
                  ? [{ label: objectType?.displayName, value: objectType?.id }]
                  : null,
                onChange: (option: { value: string }) => {
                  setValue('objectType', option, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              },
            },
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                id: 'id',
                label: 'ID',
                disabled: true,
                isSearchable: false,
                placeholder: 'Auto Generated',
              },
            },
            {
              type: InputTypes.MULTI_LINE,
              props: {
                id: 'description',
                label: 'Description',
                name: 'description',
                optional: true,
                isSearchable: false,
                placeholder: 'Write Here',
                rows: 3,
                ref: register,
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'cardinality',
                label: 'Cardinality',
                isSearchable: false,
                placeholder: 'Select ',
                options: [
                  { label: 'One-To-One', value: 'ONE_TO_ONE' },
                  { label: 'One-To-Many', value: 'ONE_TO_MANY' },
                ],
                defaultValue: cardinality
                  ? [
                      {
                        label: cardinality === 'ONE_TO_ONE' ? 'One-To-One' : 'One-To-Many',
                        value: cardinality,
                      },
                    ]
                  : null,
                isDisabled: label === 'Edit',
                onChange: (option: { value: string }) => {
                  setValue('cardinality', option.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              },
            },
          ]}
        />
        <ToggleSwitch
          height={24}
          width={48}
          offLabel="Optional"
          onColor="#24a148"
          checked={mandatory}
          onChange={(isChecked) => {
            setValue('mandatory', isChecked, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onLabel="Required"
        />
      </div>
    );
  };

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      onCloseDrawer(false);
      setSelectedRelation(null);
    }, 200);
  };

  const findHighestSortOrder = (arr: any) => {
    let highestSortOrder = 0;
    if (arr?.length > 0) {
      arr.forEach((currentObject: any) => {
        if (currentObject.sortOrder > highestSortOrder) {
          highestSortOrder = currentObject.sortOrder;
        }
      });
    }
    return highestSortOrder;
  };

  const onSubmit = () => {
    const _data = getValues();

    if (label === 'Edit') {
      const newData = {
        id: relation?.id,
        displayName: _data.displayName,
        description: _data?.description || '',
        flags: _data.mandatory ? 16 : 0,
        objectTypeId: _data?.objectType?.id,
        sortOrder: relation?.sortOrder,
        target: {
          type: 'OBJECTS',
          cardinality: _data.cardinality,
        },
        usageStatus: 1,
      };
      dispatch(
        editObjectTypeRelation({
          objectTypeId: active?.id,
          data: newData,
          relationId: relation?.id,
        }),
      );
    } else {
      let sortOrder = 1;
      let maxSortOrder = findHighestSortOrder(active?.relations || []);
      sortOrder = maxSortOrder + 1;
      const newData = {
        id: null,
        displayName: _data.displayName,
        description: _data?.description || '',
        sortOrder,
        flags: _data.mandatory ? 16 : 0,
        objectTypeId: _data?.objectType?.id,
        target: {
          type: 'OBJECTS',
          cardinality: _data.cardinality,
        },
        usageStatus: 1,
      };
      dispatch(createObjectTypeRelation({ objectTypeId: active?.id, data: newData }));
    }
    setTimeout(() => setShouldToggle((prev) => !prev), 300);
    handleCloseDrawer();
  };

  useEffect(() => {
    if (relation?.id) {
      reset({
        displayName: relation?.displayName,
        description: relation?.description,
        cardinality: relation?.target?.cardinality,
        objectType: list?.filter((currType) => currType.id === relation?.objectTypeId)?.[0],
        mandatory: relation.flags === 16 ? true : false,
      });
    }
  }, []);

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: label === 'Edit' ? 'Edit Relation' : 'Create a New Relation',
    hideCloseIcon: true,
    bodyContent: (
      <AddPropertyDrawerWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          style={{ marginBlock: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                placeholder: 'Write here',
                label: 'Label',
                id: 'displayName',
                name: 'displayName',
                ref: register({
                  required: true,
                }),
              },
            },
          ]}
        />
        {basicInformation()}
      </AddPropertyDrawerWrapper>
    ),
    footerContent: (
      <>
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Cancel
        </Button>

        <Button type="submit" disabled={!isDirty || !isValid} onClick={onSubmit}>
          {label === 'Edit' ? 'Update' : 'Create'}
        </Button>
      </>
    ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return <AddPropertyDrawerWrapper>{StyledDrawer}</AddPropertyDrawerWrapper>;
};

export default AddRelationDrawer;
