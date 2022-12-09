import {
  AutoComplete,
  BaseModal,
  Button,
  fetchDataParams,
  TextInput,
  PaginatedFetchData,
  formatOptionLabel,
  FormGroup,
} from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { Property } from '#store/properties/types';
import { baseUrl } from '#utils/apiUrls';
import { request } from '#utils/request';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { Checklist } from '#views/Checklists/types';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Cardinality } from '#views/Ontology/types';
import { isNil } from 'lodash';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { fetchParameters, fetchParametersSuccess } from '#PrototypeComposer/Activity/actions';
import ParameterView from '#PrototypeComposer/Parameters/ExecutionViews';

export interface CreateJobModalProps {
  selectedChecklist: Checklist | null;
  parameterValues: any;
  onCreateJob: (jobDetails: Record<string, string>) => void;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 500px !important;
    max-width: 720px !important;
    max-height: 80vh;

    .modal-body {
      padding: 24px !important;
      overflow: auto;

      .properties-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 32px;

        .row {
          flex: unset;
          margin-top: 24px;
          width: 48%;

          :nth-child(2n) {
            margin-left: 4%;
          }
        }

        &.vertical {
          flex-direction: column;

          .row {
            width: 100%;

            :nth-child(2n) {
              margin-left: 0;
            }
          }
        }
      }

      .input-label {
        font-size: 12px;
        text-transform: capitalize;

        .optional-badge {
          margin-left: auto;
        }
      }

      .field-error {
        margin-top: 4px;
        font-size: 12px;
      }

      .buttons-container {
        display: flex;
        margin-top: 40px;
      }
    }

    .modal-footer {
      padding: 24px !important;
    }
  }
`;

export const CreateJobModal: FC<CommonOverlayProps<CreateJobModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { parameterValues, onCreateJob, selectedChecklist },
}) => {
  const [selectOptions, setSelectOptions] = useState<
    Record<
      string,
      {
        isFetching: boolean;
        dependency?: string;
        options?: any[];
      }
    >
  >();
  const pagination = useRef<
    Record<
      string,
      {
        current: number;
        isLast: boolean;
      }
    >
  >();
  const [checklist, setChecklist] = useState(selectedChecklist);
  const [reRender, setReRender] = useState(false);
  const { selectedUseCase } = useTypedSelector((state) => state.auth);
  const { checklists, pageable, loading } = useTypedSelector((state) => state.checklistListView);
  const {
    data,
    parameters: {
      parameters: { list: parametersList, pageable: parameterPageable },
    },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();

  const fetchData = ({ page, size = 10, query = '' }: fetchDataParams) => {
    const filters = JSON.stringify({
      op: FilterOperators.AND,
      fields: [
        { field: 'code', op: FilterOperators.LIKE, values: [query] },
        { field: 'state', op: FilterOperators.EQ, values: ['PUBLISHED'] },
        { field: 'archived', op: FilterOperators.EQ, values: [false] },
        {
          field: 'useCaseId',
          op: FilterOperators.EQ,
          values: [selectedUseCase?.id],
        },
      ],
    });
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }, page === 0));
  };

  const reactForm = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    control,
    handleSubmit,
    register,
    errors,
    formState: { isDirty, isValid },
    getValues,
    setValue,
  } = reactForm;

  useEffect(() => {
    if (selectedChecklist) {
      setValue('checklistId', selectedChecklist.id, { shouldDirty: true });
    }
  }, []);

  const onSubmit = (data: any) => {
    const parameterValues = parametersList.reduce((acc, parameter: any, index: any) => {
      if (data.data[parameter.id]) {
        acc[parameter.id] = {
          parameter: data.data[parameter.id],
          reason: data.data[parameter?.id]?.response?.reason || '',
        };
        return acc;
      }
    }, {});

    console.log('zero parameter values', parameterValues);

    onCreateJob({ checklistId: data.checklistId, properties: parameterValues });
    setChecklist(null);
    closeOverlay();
  };

  const getOptions = async (path: string, inputId: string, dependency?: string) => {
    if (
      !dependency ||
      selectOptions?.[inputId]?.dependency !== dependency ||
      !pagination.current?.[inputId]?.isLast
    ) {
      try {
        pagination.current = {
          ...pagination.current,
          [inputId]: {
            current: !isNil(pagination.current?.[inputId]?.current)
              ? pagination.current![inputId].current
              : -1,
            isLast: !isNil(pagination.current?.[inputId]?.isLast)
              ? pagination.current![inputId].isLast
              : false,
          },
        };
        setSelectOptions((prev) => ({
          ...prev,
          [inputId]: {
            ...prev?.[inputId],
            isFetching: true,
            dependency,
          },
        }));
        if (inputId && path) {
          const response: ResponseObj<any> = await request(
            'GET',
            `${baseUrl}${path}&page=${
              (!isNil(pagination.current?.[inputId]?.current)
                ? pagination.current![inputId]?.current
                : -1) + 1
            }`,
          );
          if (response.data) {
            pagination.current = {
              ...pagination.current,
              [inputId]: {
                current: response?.pageable?.page || 0,
                isLast: response?.pageable?.last || false,
              },
            };
            setSelectOptions((prev) => ({
              ...prev,
              [inputId]: {
                isFetching: false,
                options: [...(prev?.[inputId]?.options || []), ...response.data],
                dependency,
              },
            }));
          }
        }
      } catch (e) {
        console.error(`Error in Fetching Options for ${inputId}`, e);
      }
    }
  };

  const fetchParametersListData = async (params: PaginatedFetchData = {}, option) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    if (option?.id) {
      dispatch(
        fetchParameters(option.id, {
          page,
          size,
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              {
                field: 'targetEntityType',
                op: FilterOperators.EQ,
                values: [TargetEntityType.PROCESS],
              },
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
            ],
          }),
          sort: 'id,desc',
        }),
      );
    }
  };

  useEffect(() => {
    fetchParametersListData({ page: DEFAULT_PAGE_NUMBER, size: DEFAULT_PAGE_SIZE }, checklist);
    if (!checklist) {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    }
  }, [checklist]);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={() => {
          closeOverlay();
          dispatch(
            fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }),
          );
        }}
        title="Creating a Job"
        showFooter={false}
      >
        <form onSubmit={handleSubmit((data) => onSubmit(data))} style={{}}>
          {selectedChecklist ? (
            <>
              <TextInput label="Checklist" defaultValue={selectedChecklist.name} disabled />
              <input
                ref={register({ required: true })}
                value={selectedChecklist.id}
                name="checklistId"
                type="hidden"
              />
            </>
          ) : (
            <AutoComplete
              control={control}
              label="Checklist"
              name="checklistId"
              choices={checklists}
              fetchData={fetchData}
              currentPage={pageable.page}
              lastPage={pageable.last}
              rules={{ required: true }}
              loading={loading}
              getOptionLabel={(option) => `${option.name} - ${option.code}`}
              getOptionSelected={(option, value) => option.id === value.id}
              onChange={(data) => setChecklist(data)}
              renderOption={(option) => (
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ color: '#666' }}>{option.name}</span>
                  <span style={{ color: '#999' }}>{option.code}</span>
                </div>
              )}
            />
          )}
          <div className={`properties-container ${parametersList.length <= 4 ? 'vertical' : ''}`}>
            {parametersList.map((parameter, index) => (
              <ParameterView key={`parameter_${index}`} form={reactForm} parameter={parameter} />
            ))}
            {/* {properties.map((property, index) => (
              <TextInput
                key={`property_${index}`}
                label={property.label}
                name={property.name}
                optional={!property.mandatory}
                ref={register({
                  required: property.mandatory ? `${property.label} is required.` : false,
                })}
                className="row"
                error={errors[property.name]?.message !== '' ? errors[property.name]?.message : ''}
              />
            ))} */}
          </div>
          {checklist && checklist?.relations?.length > 0 && (
            <FormGroup
              style={{ padding: '24px 0 0' }}
              inputs={[
                ...checklist.relations.map((relation: any) => {
                  const registrationId = `relations.${relation.externalId}`;
                  register(registrationId, {
                    required: relation.isMandatory,
                  });
                  const isMulti = relation?.target.cardinality === Cardinality.ONE_TO_MANY;
                  let variableValue: string | undefined;
                  let urlPath = relation.target.urlPath;
                  if (relation?.variables && Object.keys(relation.variables).length) {
                    const keyToCheck = Object.keys(relation.variables)[0];
                    const parsedKey = keyToCheck.replace('$', '');
                    variableValue = getValues(`relations.${parsedKey}`)?.[0]?.[
                      relation.variables[keyToCheck]
                    ];
                    if (variableValue) {
                      urlPath = relation.target.urlPath.replace(keyToCheck, variableValue);
                      getOptions(urlPath, relation.id, variableValue);
                    }
                  } else if (
                    !selectOptions?.[relation.id]?.isFetching &&
                    !selectOptions?.[relation.id]?.options
                  ) {
                    getOptions(urlPath, relation.id);
                  }
                  return {
                    type: InputTypes.MULTI_SELECT,
                    props: {
                      isMulti,
                      placeholder: `Select ${relation.displayName}`,
                      label: relation.displayName,
                      id: registrationId,
                      name: registrationId,
                      options:
                        selectOptions?.[relation.id]?.options?.map((option) => ({
                          value: option,
                          label: option.displayName,
                          externalId: option.externalId,
                        })) || [],
                      formatOptionLabel,
                      onMenuScrollToBottom() {
                        if (
                          !selectOptions?.[relation.id]?.isFetching &&
                          !pagination.current?.[relation.id]?.isLast
                        ) {
                          getOptions(urlPath, relation.id, variableValue);
                        }
                      },
                      onChange: (options: any) => {
                        setValue(
                          registrationId,
                          isMulti ? options.map((option: any) => option.value) : [options.value],
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                        setReRender(!reRender);
                      },
                    },
                  };
                }),
              ]}
            />
          )}
          <div className="buttons-container">
            <Button
              variant="secondary"
              color="red"
              onClick={() => {
                closeOverlay();
                dispatch(
                  fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }),
                );
              }}
            >
              Cancel
            </Button>
            <Button disabled={!isValid || !isDirty} type="submit">
              Create Job
            </Button>
          </div>
        </form>
      </BaseModal>
    </Wrapper>
  );
};
