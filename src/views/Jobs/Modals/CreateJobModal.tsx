import { BaseModal, Button, Select, TextInput } from '#components';
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
import { fetchDataParams, FilterOperators } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { Checklist } from '#views/Checklists/types';
import { debounce } from 'lodash';
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
  const { checklists, pageable } = useTypedSelector((state) => state.checklistListView);
  const {
    data,
    parameters: {
      parameters: { list: parametersList, pageable: parameterPageable },
      hiddenParameterIds,
    },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, query = '' } = params;
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
    handleSubmit,
    register,
    formState: { isDirty, isValid },
    setValue,
  } = reactForm;

  useEffect(() => {
    if (selectedChecklist) {
      setValue('checklistId', selectedChecklist.id, { shouldDirty: true });
    }
  }, []);

  const onSubmit = (data: any) => {
    const parameterValues = parametersList.reduce((acc, parameter: any, index: any) => {
      if (data[parameter.id]) {
        acc[parameter.id] = {
          parameter: data[parameter.id],
          reason: data[parameter?.id]?.response?.reason || '',
        };
      }
      return acc;
    }, {});

    onCreateJob({ checklistId: data.checklistId, parameterValues });
  };

  const fetchParametersListData = async (params: fetchDataParams = {}, option) => {
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
    if (
      [MandatoryParameter.SINGLE_SELECT, MandatoryParameter.RESOURCE].includes(parameterData.type)
    ) {
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
    if (!selectedChecklist) {
      register('checklistId', { required: true });
    }
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
              <TextInput label="Process" defaultValue={selectedChecklist.name} disabled />
              <input
                ref={register({ required: true })}
                value={selectedChecklist.id}
                name="checklistId"
                type="hidden"
              />
            </>
          ) : (
            <Select
              label="Process"
              placeholder="Process"
              isClearable
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldBlockScroll
              options={checklists.map((currChecklist) => ({
                ...currChecklist,
                label: currChecklist.name,
                externalId: currChecklist.code,
              }))}
              onMenuScrollToBottom={() => {
                if (!pageable.last) {
                  fetchData({
                    page: pageable.page + 1,
                  });
                }
              }}
              onChange={(data) => {
                if (data) {
                  setValue('checklistId', data.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
                setChecklist(data);
              }}
              onInputChange={debounce((value) => {
                fetchData({
                  query: value,
                });
              }, 500)}
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
