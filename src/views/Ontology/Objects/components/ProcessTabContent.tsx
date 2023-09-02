import { Checklist, DisabledStates } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { DataTable, Pagination, SearchFilter, ToggleSwitch } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission, { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { apiGetProcessesByResource } from '#utils/apiUrls';
import {
  ALL_FACILITY_ID,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
} from '#utils/constants';
import { FilterField, FilterOperators, fetchDataParams } from '#utils/globalTypes';
import { request } from '#utils/request';
import CreateJob from '#views/Jobs/Components/CreateJob';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const getBaseFilter = (): FilterField[] => [
  { field: 'archived', op: FilterOperators.EQ, values: [false] },
];

const ProcessTabContent = () => {
  const dispatch = useDispatch();
  const {
    auth: { selectedFacility: { id: facilityId = '' } = {}, selectedUseCase, roles: userRoles },
    ontology: {
      objects: { active: selectedObject },
      objectTypes: { active: selectedObjectType },
    },
  } = useTypedSelector((state) => state);

  const [createJobDrawerVisible, setCreateJobDrawerVisible] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [filterFields, setFilterFields] = useState<FilterField[]>(getBaseFilter());

  const [state, setState] = useState<Record<string, any>>({
    list: [],
    pageable: DEFAULT_PAGINATION,
  });

  const { list, pageable } = state;

  const handleOnCreateJob = (item: Checklist) => {
    if (userRoles?.some((role) => role === roles.ACCOUNT_OWNER) && facilityId === ALL_FACILITY_ID) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.ENTITY_START_ERROR_MODAL,
          props: {
            entity: ComposerEntity.JOB,
          },
        }),
      );
    } else {
      setSelectedChecklist(item);
      setCreateJobDrawerVisible(true);
    }
  };

  const fetchData = async (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    try {
      const { data, pageable } = await request(
        'GET',
        apiGetProcessesByResource(selectedObjectType!.id),
        {
          params: {
            facilityId,
            page,
            size,
            sort: 'createdAt,desc',
            filters: {
              op: FilterOperators.AND,
              fields: [
                ...filters,
                {
                  field: 'useCaseId',
                  op: FilterOperators.EQ,
                  values: [selectedUseCase?.id],
                },
                {
                  field: 'state',
                  op: FilterOperators.EQ,
                  values: [DisabledStates.PUBLISHED],
                },
                ...(facilityId === ALL_FACILITY_ID
                  ? [
                      {
                        field: 'isGlobal',
                        op: FilterOperators.EQ,
                        values: [true],
                      },
                    ]
                  : []),
              ],
            },
          },
        },
      );

      if (data) {
        setState({
          list: data,
          pageable,
        });
      }
    } catch (error) {
      console.error('error from fetch Processes in object view :: ', error);
    }
  };

  useEffect(() => {
    if (selectedObject) {
      fetchData({ filters: filterFields });
    }
  }, [filterFields]);

  const columns = [
    {
      id: 'name',
      label: 'Process Name',
      minWidth: 240,
      format: function renderComp(item: Checklist) {
        return (
          <span
            className="primary"
            onClick={() => {
              navigate(`/checklists/${item.id}`);
            }}
            title={item.name}
          >
            {item.name}
          </span>
        );
      },
    },
    {
      id: 'checklist-id',
      label: 'Process ID',
      minWidth: 152,
      format: function renderComp(item: Checklist) {
        return <div key={item.id}>{item.code}</div>;
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      format: function renderComp(item: Checklist) {
        return (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {!item.archived && checkPermission(['checklists', 'createJob']) && (
              <div
                className="primary"
                style={{ height: 18 }}
                onClick={async () => {
                  handleOnCreateJob(item);
                }}
              >
                <span>Create Job</span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <TabContentWrapper>
        <div className="filters">
          <SearchFilter
            style={{ width: 300 }}
            label={'label'}
            showDropdown={false}
            dropdownOptions={[
              {
                label: 'Process Name',
                value: 'name',
                field: 'name',
                operator: FilterOperators.LIKE,
              },
            ]}
            updateFilterFields={(fields) => {
              setFilterFields((currentFields) => {
                const updatedFilterFields = [
                  ...currentFields.filter((field) => field.field !== 'name'),
                  ...fields.filter((f) => f?.values?.[0]),
                ];
                return updatedFilterFields;
              });
            }}
          />

          <ToggleSwitch
            checkedIcon={false}
            uncheckedIcon={false}
            offLabel="Show Archived"
            onLabel="Showing Archived"
            checked={!!filterFields.find((field) => field.field === 'archived')?.values[0]}
            onChange={(isChecked) =>
              setFilterFields((currentFields) => {
                const updatedFilterFields = currentFields.map((field) => ({
                  ...field,
                  ...(field.field === 'archived'
                    ? { values: [isChecked] }
                    : { values: field.values }),
                })) as FilterField[];
                return updatedFilterFields;
              })
            }
          />
        </div>
        <div style={{ display: 'contents' }}>
          <DataTable
            columns={columns}
            rows={list.map((item) => {
              return {
                ...item,
              };
            })}
            emptyTitle="No Associated Process Found"
          />
          <Pagination pageable={pageable} fetchData={fetchData} />
        </div>
        {createJobDrawerVisible && selectedChecklist && (
          <CreateJob
            checklist={{ label: selectedChecklist.name, value: selectedChecklist.id }}
            onCloseDrawer={setCreateJobDrawerVisible}
            selectedObject={selectedObject}
          />
        )}
      </TabContentWrapper>
    </div>
  );
};

export default ProcessTabContent;
