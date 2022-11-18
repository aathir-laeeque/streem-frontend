import { Button, DataTable, PaginatedFetchData, Pagination, TextInput } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { fetchParameters, toggleNewParameter } from '#PrototypeComposer/Activity/actions';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap, TargetEntityTypeVisual } from '#PrototypeComposer/constants';
import { TabPanelWrapper } from '#PrototypeComposer/styles';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ParametersList = () => {
  const {
    data,
    parameters: {
      parameters: { list, listLoading, pageable },
    },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();
  const [filterFields, setFilterFields] = useState<FilterField[]>([
    { field: 'archived', op: FilterOperators.EQ, values: [false] },
  ]);

  const fetchData = async (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    if (data?.id) {
      dispatch(
        fetchParameters(data.id, {
          page,
          size,
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: filterFields,
          }),
        }),
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterFields]);

  return (
    <TabPanelWrapper>
      <TabContentWrapper>
        <div className="filters" style={{ padding: '0 0 16px' }}>
          <div style={{ maxWidth: 500 }}>
            <TextInput
              afterElementWithoutError
              AfterElement={Search}
              afterElementClass=""
              placeholder={`Search Parameter`}
              onChange={debounce(
                ({ value }) =>
                  setFilterFields((prev) => [
                    ...prev.filter((field) => field.field !== 'label'),
                    { field: 'label', op: FilterOperators.LIKE, values: [value] },
                  ]),
                500,
              )}
            />
          </div>
          <Button
            id="create"
            variant="secondary"
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.CONFIGURE_JOB_PARAMETERS,
                  props: {
                    checklistId: data?.id!,
                  },
                }),
              );
            }}
            style={{ marginRight: 16 }}
          >
            Configure 'Create job' form
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(
                toggleNewParameter({ action: 'list', title: 'Create a New Process Parameter' }),
              );
            }}
          >
            Create Parameter
          </Button>
        </div>
        <LoadingContainer
          loading={listLoading}
          component={
            <>
              <DataTable
                columns={[
                  {
                    id: 'label',
                    label: 'Process Parameter',
                    minWidth: 240,
                    format: (item) => {
                      return (
                        <span
                          className="primary"
                          onClick={() => {
                            dispatch(
                              toggleNewParameter({
                                action: 'list',
                                title: `Edit Process ${
                                  item.type === MandatoryParameter.CHECKLIST
                                    ? 'Subtask'
                                    : item.type in MandatoryParameter
                                    ? 'Parameter'
                                    : 'Instruction'
                                }`,
                                parameterId: item.id,
                                fetchData,
                              }),
                            );
                          }}
                          title={item.label}
                        >
                          {item.label}
                        </span>
                      );
                    },
                  },
                  {
                    id: 'type',
                    label: 'Type',
                    minWidth: 152,
                    format: (item) => ParameterTypeMap[item.type],
                  },
                  {
                    id: 'targetEntityType',
                    label: 'Location',
                    minWidth: 152,
                    format: (item) => TargetEntityTypeVisual[item.targetEntityType],
                  },
                  {
                    id: 'mandatory',
                    label: 'Is Required?',
                    minWidth: 152,
                    format: (item) => (item.mandatory ? 'Yes' : 'No'),
                  },
                ]}
                rows={list}
              />
              <Pagination pageable={pageable} fetchData={fetchData} />
            </>
          }
        />
      </TabContentWrapper>
    </TabPanelWrapper>
  );
};

export default ParametersList;
