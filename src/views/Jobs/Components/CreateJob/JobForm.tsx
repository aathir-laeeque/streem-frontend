import { PaginatedFetchData, Select } from '#components';
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
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { debounce } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

export interface JobFormProps {
  form: any;
  checklist?: Record<string, string>;
  selectedObject?: any;
}

const JobFormWrapper = styled.div.attrs({})`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const JobForm: FC<JobFormProps> = ({ form, checklist, selectedObject }) => {
  const { register, setValue, watch } = form;
  const { checklistId } = watch(['checklistId']);
  const dispatch = useDispatch();
  const {
    auth: { selectedUseCase },
    checklistListView: { checklists, pageable, loading },
    prototypeComposer: {
      parameters: {
        parameters: { list: parametersList, pageable: parameterPageable },
        hiddenParameterIds,
      },
    },
  } = useTypedSelector((state) => state);

  useEffect(() => {
    const initialHiddenParameters: Record<string, string[]>[] = [];
    if (parametersList.length) {
      let updatedParam = {
        hide: [],
        show: [],
      };
      parametersList.forEach((param) => {
        if (param.hidden) {
          updatedParam = { ...param, hide: [...updatedParam.hide, param.id], show: [] };
          initialHiddenParameters.push(updatedParam);
          dispatch(updateHiddenParameterIds(initialHiddenParameters));
        }
      });
    }

    return () => {
      dispatch(updateHiddenParameterIds([]));
    };
  }, [parametersList]);

  const fetchChecklistsData = (
    params: {
      page?: number;
      size?: number;
      query?: string;
      filters?: FilterField[];
    } = {},
  ) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, query = '' } = params;
    const filters = JSON.stringify({
      op: FilterOperators.AND,
      fields: [
        { field: 'name', op: FilterOperators.LIKE, values: [query] },
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

  const onChangeHandler = (parameterData: Parameter) => {
    let parameterValues: Record<string, any> = {};
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

  const fetchParametersListData = async (params: PaginatedFetchData = {}, option: string) => {
    const { page = DEFAULT_PAGE_NUMBER, size = 250 } = params;
    if (option) {
      dispatch(
        fetchParameters(option, {
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

  useEffect(() => {
    register('checklistId', { required: true });
    if (checklist) {
      setValue('checklistId', checklist.value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    return () => {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    };
  }, []);

  useEffect(() => {
    if (checklistId) {
      fetchParametersListData({ page: DEFAULT_PAGE_NUMBER }, checklistId);
    } else {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    }
  }, [checklistId]);

  return (
    <JobFormWrapper>
      <Select
        label="Process"
        placeholder="Process"
        isClearable
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuShouldBlockScroll
        isLoading={loading}
        onMenuOpen={() => {
          if (!pageable.page) {
            fetchChecklistsData({
              page: pageable.page,
            });
          }
        }}
        options={checklists.map((currChecklist) => ({
          ...currChecklist,
          label: currChecklist.name,
          externalId: currChecklist.code,
        }))}
        onMenuScrollToBottom={() => {
          if (!pageable.last) {
            fetchChecklistsData({
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
        }}
        onInputChange={debounce((value, actionMeta) => {
          if (actionMeta.prevInputValue !== value)
            fetchChecklistsData({
              query: value,
            });
        }, 500)}
        {...(checklist && {
          defaultValue: [checklist],
          isDisabled: true,
        })}
      />
      {parametersList.map(
        (parameter) =>
          !hiddenParameterIds[parameter.id] && (
            <ParameterView
              key={parameter.id}
              form={form}
              parameter={parameter}
              onChangeHandler={onChangeHandler}
              selectedObject={selectedObject}
            />
          ),
      )}
    </JobFormWrapper>
  );
};