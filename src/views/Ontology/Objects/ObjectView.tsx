import {
  Button1,
  formatOptionLabel,
  FormGroup,
  FormGroupProps,
  TabContentProps,
} from '#components';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { baseUrl } from '#utils/apiUrls';
import { InputTypes, SelectOptions } from '#utils/globalTypes';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { get, merge, set } from 'lodash';
import React, { FC, useRef, useState } from 'react';
import { RegisterOptions, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createObject, editObject } from '../actions';
import { FlagPositions, getBooleanFromDecimal } from '../ObjectTypes';
import { Cardinality, CommonFields, Constraint, Validation } from '../types';

const ObjectFormWrapper = styled.div`
  background-color: #fff;
  overflow: auto;

  form {
    margin: auto;
    max-width: 500px;

    .error-container {
      color: #cc5656;
    }

    .actions {
      padding: 0 16px 16px;
      display: flex;
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
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors, dirtyFields },
    getValues,
    setValue,
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const [selectOptions, setSelectOptions] = useState<
    Record<
      string,
      {
        isFetching: boolean;
        dependency?: string;
        options?: CommonFields[];
      }
    >
  >();
  const dateTimeInputs = useRef<Record<string, string>>({});
  const [reRender, setReRender] = useState(false);
  const isReadOnly = readOnly || !checkPermission(['ontology', 'edit']) || !id;
  const isEditing = id && id !== 'new';

  const getOptions = async (path: string, inputId: string, dependency?: string) => {
    if (!dependency || selectOptions?.[inputId]?.dependency !== dependency) {
      try {
        setSelectOptions({
          ...selectOptions,
          [inputId]: {
            isFetching: true,
            dependency,
          },
        });
        if (inputId && path) {
          const response: {
            data: CommonFields[];
            errors: { message: string }[];
          } = await request('GET', `${baseUrl}${path}`);
          if (response.data) {
            setSelectOptions({
              ...selectOptions,
              [inputId]: {
                isFetching: false,
                options: response.data,
                dependency,
              },
            });
          }
        }
      } catch (e) {
        console.error(`Error in Fetching Options for ${inputId}`, e);
      }
    }
  };

  const parseData = (data: Record<string, Record<string, string>>) => {
    return merge(
      {
        ...data,
        ...(data?.relations &&
          Object.entries<string>(data.relations).reduce<Record<string, Record<string, string>>>(
            (acc, [key, value]) => {
              const relation = selectedObjectType?.relations.find(
                (relation) => relation.externalId === key,
              );
              if (relation) {
                acc['relations'][relation.id] = value;
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
        const editedData = Object.keys(data).reduce<Record<string, Record<string, string>>>(
          (acc, key) => {
            acc[key] = {};
            return acc;
          },
          {},
        );
        Object.entries(dirtyFields).forEach(([key, value]) => {
          editedData[key] = {};
          Object.keys(value).forEach((_key) => {
            editedData[key][_key] = get(data, [key, _key]);
          });
        });
        const parsedData = parseData(editedData);
        dispatch(editObject(parsedData, objectTypeId, id, onDone));
      } else {
        const parsedData = parseData(data);
        dispatch(createObject(parsedData, objectTypeId, onDone));
      }
    }
  };

  if (!selectedObjectType) return null;

  return (
    <ObjectFormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          inputs={[
            ...selectedObjectType.properties.reduce<FormGroupProps['inputs']>(
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
                      isDisabled: isReadOnly,
                      ...(isReadOnly && { styles: undefined }),
                      onChange: (_options: { value: string } | { value: string }[]) => {
                        setValue(
                          registrationId,
                          Array.isArray(_options)
                            ? _options.map((option) => option.value)
                            : [_options.value],
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                      },
                    },
                  });
                } else {
                  const isAutoGenerated = getBooleanFromDecimal(flags, FlagPositions.AUTOGENERATE);
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
            ...selectedObjectType.relations.reduce<FormGroupProps['inputs']>((acc, relation) => {
              const registrationId = `relations.${relation.externalId}`;
              register(registrationId);
              const isMulti = relation.target.cardinality === Cardinality.ONE_TO_MANY;
              let defaultValue: SelectOptions;
              if (!isDirty && selectedObject) {
                defaultValue = selectedObject.relations
                  .find((_relation) => _relation.id === relation.id)
                  ?.targets?.map((value) => ({
                    label: value.displayName,
                    value: value.id,
                    externalId: value.externalId,
                  }));
                if (defaultValue)
                  setValue(registrationId, defaultValue, {
                    shouldValidate: true,
                  });
              }
              if (!isReadOnly) {
                if (relation?.variables && Object.keys(relation.variables).length) {
                  const keyToCheck = Object.keys(relation.variables)[0];
                  const parsedKey = keyToCheck.replace('$', '');
                  const variableValue = getValues(`relations.${parsedKey}`)?.[0]?.[
                    relation.variables[keyToCheck]
                  ];
                  if (variableValue) {
                    getOptions(
                      relation.target.urlPath.replace(keyToCheck, variableValue),
                      relation.id,
                      variableValue,
                    );
                  }
                } else if (
                  !selectOptions?.[relation.id]?.isFetching &&
                  !selectOptions?.[relation.id]?.options
                ) {
                  getOptions(relation.target.urlPath, relation.id);
                }
              }
              acc.push({
                type: InputTypes.MULTI_SELECT,
                props: {
                  defaultValue,
                  isMulti,
                  placeholder: `Select ${relation.displayName}`,
                  label: relation.displayName,
                  id: registrationId,
                  name: registrationId,
                  formatOptionLabel,
                  isDisabled: isReadOnly,
                  ...(isReadOnly && { styles: undefined }),
                  options: selectOptions?.[relation.id]?.options?.map((option) => ({
                    value: option,
                    label: option.displayName,
                    externalId: option.externalId,
                  })),
                  onChange: (options: { value: CommonFields } | { value: CommonFields }[]) => {
                    setValue(
                      registrationId,
                      Array.isArray(options)
                        ? options.map((option) => option.value)
                        : [options.value],
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                    setReRender(!reRender);
                  },
                },
              });
              return acc;
            }, []),
          ]}
        />
        {!isReadOnly && (
          <div className="actions">
            <Button1 type="submit" disabled={!isDirty || !isValid}>
              {isEditing ? 'Update' : 'Create'}
            </Button1>
            <Button1
              variant="secondary"
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </Button1>
          </div>
        )}
      </form>
    </ObjectFormWrapper>
  );
};

export default ObjectView;
