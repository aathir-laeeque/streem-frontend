import {
  AutoComplete,
  BaseModal,
  Button,
  fetchDataParams,
  PaginatedFetchData,
  TextInput,
} from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import {
  executeBranchingRulesParameter,
  updateHiddenParameterIds,
} from '#PrototypeComposer/actions';
import { fetchParameters, fetchParametersSuccess } from '#PrototypeComposer/Activity/actions';
import { Parameter } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, TargetEntityType } from '#PrototypeComposer/checklist.types';
import ParameterView from '#PrototypeComposer/Parameters/ExecutionViews';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { Checklist } from '#views/Checklists/types';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

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
  const [checklist, setChecklist] = useState(selectedChecklist);
  const { selectedUseCase } = useTypedSelector((state) => state.auth);
  const { checklists, pageable, loading } = useTypedSelector((state) => state.checklistListView);
  const {
    data,
    parameters: {
      parameters: { list: parametersList, pageable: parameterPageable },
      hiddenParameterIds,
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
      }
      return acc;
    }, {});

    onCreateJob({ checklistId: data.checklistId, parameterValues });
  };

  const fetchParametersListData = async (params: PaginatedFetchData = {}, option) => {
    const { page = DEFAULT_PAGE_NUMBER, size = 250 } = params;
    if (option?.id) {
      dispatch(
        fetchParameters(option.id, {
          page,
          size,
          filters: {
            op: FilterOperators.AND,
            fields: [
              {
                field: 'targetEntityType',
                op: FilterOperators.EQ,
                values: [TargetEntityType.PROCESS],
              },
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
            ],
          },
          sort: 'orderTree,asc',
        }),
      );
    }
  };

  const onCloseHandler = () => {
    dispatch(updateHiddenParameterIds([]));
    closeOverlay();
  };

  const onChangeHandler = (parameterData: Parameter) => {
    let parameterValues: Record<string, Parameter> = {};
    if (parameterData.type === MandatoryParameter.SINGLE_SELECT) {
      parameterValues[parameterData.id] = {
        parameter: parameterData,
        reason: parameterData?.response?.reason || '',
      };
      dispatch(executeBranchingRulesParameter(parameterValues));
    }
  };

  useEffect(() => {
    fetchParametersListData({ page: DEFAULT_PAGE_NUMBER }, checklist);
    if (!checklist) {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    }
  }, [checklist]);

  useEffect(() => {
    return () => {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    };
  }, []);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={onCloseHandler}
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
            {parametersList.map(
              (parameter, index) =>
                hiddenParameterIds[parameter.id] !== true && (
                  <ParameterView
                    key={`parameter_${index}`}
                    form={reactForm}
                    parameter={parameter}
                    onChangeHandler={onChangeHandler}
                  />
                ),
            )}
          </div>
          <div className="buttons-container">
            <Button variant="secondary" color="red" onClick={onCloseHandler}>
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
