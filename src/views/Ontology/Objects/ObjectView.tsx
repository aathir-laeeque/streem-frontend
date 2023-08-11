import { Button, FormGroup, FormGroupProps, TabContentProps } from '#components';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { baseUrl } from '#utils/apiUrls';
import { InputTypes, SelectOptions } from '#utils/globalTypes';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { get, merge, set } from 'lodash';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Controller, RegisterOptions, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FlagPositions, getBooleanFromDecimal } from '../ObjectTypes';
import { createObject, editObject } from '../actions';
import { Cardinality, CommonFields, Constraint, Validation } from '../types';

const ObjectFormWrapper = styled.div`
  background-color: #fff;
  height: 100%;
  display: flex;
  flex: 1;

  form {
    display: flex;
    flex: 1;
    flex-direction: column;

    .form-group {
      justify-content: space-between;
    }

    .error-container {
      color: #cc5656;
    }

    .actions {
      padding: 0 16px 16px;
      display: flex;
      flex-direction: row-reverse;
      gap: 16px;
      button {
        margin-right: 0;
      }
    }
  }
`;

const getValidations = (validations?: Validation[]) => {
  if (!validations?.length) return null;
  const validators: RegisterOptions = {
    validate: {},
  };
  validations.forEach((validation) => {
    switch (validation.constraint) {
      case Constraint.GT:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string) =>
            (value && parseInt(value) > parseInt(validation.value)) || validation.errorMessage,
        };
        break;
      case Constraint.LT:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string) =>
            (value && parseInt(value) < parseInt(validation.value)) || validation.errorMessage,
        };
        break;
      case Constraint.GTE:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string) =>
            (value && parseInt(value) >= parseInt(validation.value)) || validation.errorMessage,
        };
        break;
      case Constraint.LTE:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string) =>
            (value && parseInt(value) <= parseInt(validation.value)) || validation.errorMessage,
        };
        break;
      case Constraint.MIN:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string | []) =>
            (value && value.length >= parseInt(validation.value)) || validation.errorMessage,
        };
        break;
      case Constraint.MAX:
        validators.validate = {
          ...validators.validate,
          [validation.constraint]: (value: string | []) =>
            (value && value.length <= parseInt(validation.value)) || validation.errorMessage,
        };
        break;
    }
  });
  return validators;
};

const RelationField = memo<any>(({ relation, isReadOnly, getValues, control }) => {
  const {
    objects: { active: selectedObject },
  } = useTypedSelector((state) => state.ontology);

  const [selectOptions, setSelectOptions] = useState<{
    isFetching: boolean;
    options: CommonFields[];
  }>({
    isFetching: false,
    options: [],
  });

  const pagination = useRef({
    current: -1,
    isLast: true,
  });

  const registrationId = `relations.${relation?.id}`;

  const defaultValue = selectedObject?.relations
    .find((_relation) => _relation.id === relation.id)
    ?.targets?.map((value) => ({
      ...value,
      label: value.displayName,
      value: value.id,
      externalId: `(ID: ${value.externalId})`,
    }));

  const getOptions = async (path: string) => {
    try {
      setSelectOptions((prev) => ({
        ...prev,
        isFetching: true,
      }));
      if (path) {
        const response: {
          data: CommonFields[];
          errors: { message: string }[];
          pageable: any;
        } = await request('GET', `${baseUrl}${path}&page=${pagination.current.current + 1}`);
        if (response.pageable) {
          pagination.current = {
            current: response.pageable?.page,
            isLast: response.pageable?.last,
          };
        }
        if (response.data) {
          setSelectOptions((prev) => ({
            isFetching: false,
            options: [...prev.options, ...response.data],
          }));
        }
      }
    } catch (e) {
      console.error(`Error in Fetching Options for ${relation.id}`, e);
    } finally {
      setSelectOptions((prev) => ({
        ...prev,
        isFetching: false,
      }));
    }
  };

  useEffect(() => {
    if (!isReadOnly) {
      getOptions(relation.target.urlPath);
    }
  }, []);

  const handleMenuScrollToBottom = () => {
    if (!selectOptions.isFetching && !pagination.current.isLast) {
      getOptions(relation.target.urlPath);
    }
  };

  return (
    <Controller
      name={registrationId}
      control={control}
      key={registrationId}
      rules={{
        required: !(relation?.flags === 0),
      }}
      defaultValue={defaultValue || null}
      render={({ onChange, value, name }) => {
        return (
          <FormGroup
            inputs={[
              {
                type: InputTypes.MULTI_SELECT,
                props: {
                  value,
                  name,
                  id: name,
                  isMulti: relation.target.cardinality === Cardinality.ONE_TO_MANY,
                  placeholder: `Select ${relation.displayName}`,
                  label: relation.displayName,
                  isDisabled: isReadOnly,
                  optional: relation?.flags === 0,
                  ...(isReadOnly && { styles: undefined }),
                  options: selectOptions?.options?.map((option) => ({
                    ...option,
                    value: option?.id,
                    label: option.displayName,
                    externalId: `(ID: ${option.externalId})`,
                  })),
                  onMenuScrollToBottom: handleMenuScrollToBottom,
                  onChange: (options: any) => {
                    if (options?.value) {
                      onChange(
                        Array.isArray(options) ? options.map((option) => option) : [options],
                      );
                    } else {
                      onChange(
                        options
                          ? Array.isArray(options)
                            ? options?.map((option) => option)
                            : [options]
                          : [],
                      );
                    }
                  },
                },
              },
            ]}
          />
        );
      }}
    />
  );
});

const ObjectView: FC<TabContentProps> = ({
  label,
  values: {
    objectTypeId,
    id,
    readOnly = false,
    onCancel = () => navigate(-1),
    onDone = () => navigate(-1),
  },
}) => {
  const dispatch = useDispatch();
  const {
    objects: { active: selectedObject },
    objectTypes: { active: selectedObjectType },
  } = useTypedSelector((state) => state.ontology);
  const { data: jobData } = useTypedSelector((state) => state.composer);
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors, dirtyFields },
    getValues,
    setValue,
    control,
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const dateTimeInputs = useRef<Record<string, string>>({});
  const isArchived = selectedObject?.usageStatus === 7;
  const isReadOnly = readOnly || !checkPermission(['ontology', 'editObject']) || !id || isArchived;
  const isEditing = id && id !== 'new';

  const parseData = (data: Record<string, Record<string, string>>) => {
    return merge(
      {
        ...data,
        ...(data?.relations &&
          Object.entries<string>(data?.relations)?.reduce<
            Record<string, Record<string, string | null>>
          >(
            (acc, [key, value]) => {
              const relation = selectedObjectType?.relations.find(
                (relation) => relation.id === key,
              );
              if (relation) {
                acc['relations'][relation?.id] = value ? value : null;
              }
              return acc;
            },
            {
              relations: {},
            },
          )),
      },
      dateTimeInputs.current,
    );
  };

  const onSubmit = (data: Record<string, Record<string, string>>) => {
    if (objectTypeId) {
      if (isEditing) {
        const editedData = Object.keys(data)?.reduce<Record<string, Record<string, string>>>(
          (acc, key) => {
            acc[key] = {};
            return acc;
          },
          {},
        );
        Object.entries(dirtyFields).forEach(([key, value]) => {
          editedData[key] = {};
          Object.keys(value).forEach((_key) => {
            if (key === 'relations') {
              editedData[key] = { ...data.relations };
            } else {
              editedData['relations'] = { ...data.relations };
            }
            editedData[key][_key] = get(data, [key, _key]);
          });
        });
        const parsedData = parseData(editedData);
        dispatch(editObject(parsedData, objectTypeId, id, onDone));
      } else {
        const parsedData = parseData(data);
        const reason = label ? 'Changed as per Process:' : null;
        const info = label
          ? {
              jobCode: jobData?.code,
              jobId: jobData?.id,
              processCode: jobData?.checklist?.code,
              processId: jobData?.checklist?.id,
              processName: jobData?.checklist?.name,
            }
          : null;
        dispatch(createObject(parsedData, objectTypeId, onDone, reason, info));
      }
    }
  };

  if (!selectedObjectType) return null;

  return (
    <ObjectFormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          inputs={[
            ...selectedObjectType.properties
              ?.filter((property) => property.flags !== 1)
              ?.reduce<FormGroupProps['inputs']>(
                (acc, { id, flags, validations, inputType, displayName, options }) => {
                  const registrationId = `properties.${id}`;
                  const isRequired = getBooleanFromDecimal(flags, FlagPositions.MANDATORY);
                  const validators = getValidations(validations);
                  const errorsValues = get(errors, registrationId);

                  if ([InputTypes.SINGLE_SELECT, InputTypes.MULTI_SELECT].includes(inputType)) {
                    register(registrationId, {
                      required: isRequired,
                      ...(validators && validators),
                    });
                    let defaultValue: SelectOptions;
                    if (!isDirty && selectedObject) {
                      defaultValue = selectedObject.properties
                        .find((_property) => _property.id === id)
                        ?.choices?.map((value) => ({
                          label: value.displayName,
                          value: value.id,
                        }));
                      if (defaultValue)
                        setValue(registrationId, defaultValue, {
                          shouldValidate: true,
                        });
                    }
                    acc.push({
                      type: inputType,
                      props: {
                        defaultValue,
                        placeholder: `Select ${displayName}`,
                        label: displayName,
                        id: registrationId,
                        name: registrationId,
                        options: options?.map((option) => ({
                          label: option.displayName,
                          value: option.id,
                        })),
                        optional: !isRequired,
                        isDisabled: isReadOnly,
                        ...(isReadOnly && { styles: undefined }),
                        onChange: (_options: { value: string } | { value: string }[]) => {
                          setValue(
                            registrationId,
                            _options
                              ? Array.isArray(_options)
                                ? _options.map((option) => option.value)
                                : [_options.value]
                              : undefined,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          );
                        },
                      },
                    });
                  } else {
                    const isAutoGenerated = getBooleanFromDecimal(
                      flags,
                      FlagPositions.AUTOGENERATE,
                    );
                    let defaultValue: string | undefined;
                    if (isAutoGenerated || (!isDirty && selectedObject)) {
                      defaultValue = selectedObject?.properties.find(
                        (_property) => _property.id === id,
                      )?.value;
                    }
                    acc.push({
                      type: inputType,
                      props: {
                        defaultValue,
                        placeholder: isAutoGenerated ? 'Auto Generated' : `Enter ${displayName}`,
                        label: displayName,
                        id: registrationId,
                        name: registrationId,
                        disabled: isReadOnly,
                        readOnly: isAutoGenerated,
                        optional: !isRequired,
                        ref: register({
                          required: isAutoGenerated ? false : isRequired,
                          ...(validators && validators),
                          pattern: /.*\S+.*/,
                        }),
                        ...([InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                          inputType,
                        ) && {
                          onChange: ({ value }: { name: string; value: string }) => {
                            set(dateTimeInputs.current, registrationId, value);
                          },
                        }),
                        ...(inputType === InputTypes.MULTI_LINE && {
                          rows: 3,
                        }),
                      },
                    });
                  }

                  if (validators && errorsValues) {
                    acc.push({
                      type: InputTypes.ERROR_CONTAINER,
                      props: {
                        messages: errorsValues?.types,
                      },
                    });
                  }

                  return acc;
                },
                [],
              ),
          ]}
        />
        {(selectedObjectType?.relations ?? [])?.map((relation) => (
          <RelationField
            key={relation.id}
            relation={relation}
            isReadOnly={isReadOnly}
            getValues={getValues}
            control={control}
          />
        ))}
        <div className="actions">
          {!isReadOnly && (
            <Button type="submit" disabled={!isDirty || !isValid}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          )}
          {(!isReadOnly || isArchived) && (
            <Button
              variant="secondary"
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </ObjectFormWrapper>
  );
};

export default ObjectView;
