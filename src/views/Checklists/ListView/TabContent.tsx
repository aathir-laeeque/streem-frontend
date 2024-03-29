import {
  Checklist,
  ChecklistStatesColors,
  ChecklistStatesContent,
  DisabledStates,
} from '#PrototypeComposer/checklist.types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import MemoArchive from '#assets/svg/Archive';
import FilterIcon from '#assets/svg/FilterIcon.svg';
import MemoStartRevision from '#assets/svg/StartRevision';
import MemoViewInfo from '#assets/svg/ViewInfo';
import {
  Button,
  DataTable,
  ImageUploadButton,
  ListActionMenu,
  Pagination,
  SearchFilter,
  ToggleSwitch,
} from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission, { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { apiImportChecklist } from '#utils/apiUrls';
import { ALL_FACILITY_ID, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { Error, FilterField, FilterOperators, fetchDataParams } from '#utils/globalTypes';
import CreateJob from '#views/Jobs/Components/CreateJob';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Chip, CircularProgress, MenuItem } from '@material-ui/core';
import { ArrowDropDown, FiberManualRecord } from '@material-ui/icons';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addRevisionPrototype } from '../NewPrototype/actions';
import { FormMode } from '../NewPrototype/types';
import FiltersDrawer from '../Overlays/FilterDrawer';
import {
  archiveChecklist,
  clearData,
  exportChecklist,
  fetchChecklistsForListView,
  unarchiveChecklist,
} from './actions';
import { ListViewProps } from './types';

const getBaseFilter = (label: string): FilterField[] => [
  { field: 'archived', op: FilterOperators.EQ, values: [false] },
  ...(label === 'prototype'
    ? ([
        {
          field: 'state',
          op: FilterOperators.NE,
          values: [DisabledStates.DEPRECATED],
        },
        {
          field: 'state',
          op: FilterOperators.NE,
          values: [DisabledStates.PUBLISHED],
        },
      ] as FilterField[])
    : [
        {
          field: 'state',
          op: FilterOperators.EQ,
          values: [DisabledStates.PUBLISHED],
        },
      ]),
];

const TypeChip = styled(Chip)<{ $fontColor: string; $backGroundColor: string }>`
  height: 24px !important;
  background-color: ${({ $backGroundColor }) => $backGroundColor} !important;
  color: ${({ $fontColor }) => $fontColor} !important;
  line-height: 1.33;
  letter-spacing: 0.32px;
  font-size: 12px !important;
`;

const ListView: FC<ListViewProps & { label: string }> = ({ navigate = navigateTo, label }) => {
  const dispatch = useDispatch();
  const {
    checklistListView: { pageable, currentPageData, loading: checklistDataLoading },
    auth: {
      userId,
      selectedUseCase,
      roles: userRoles,
      selectedFacility: { id: facilityId = '' } = {},
    },
    properties: propertiesStoreData,
  } = useTypedSelector((state) => state);

  const { list: checklistProperties, loading: checklistPropertiesLoading } =
    propertiesStoreData[ComposerEntity.CHECKLIST];

  const selectChecklist = (id: string | number) => navigate(`/checklists/${id}`);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createJobDrawerVisible, setCreateJobDrawerVisible] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [filterFields, setFilterFields] = useState<FilterField[]>(getBaseFilter(label));
  const [searchFilterFields, setSearchFilterFields] = useState<FilterField[]>([]);
  const [showPrototypeFilterDrawer, setPrototypeFilterDrawer] = useState<boolean>(false);

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => setSelectedChecklist(null), 200);
  };

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    dispatch(
      fetchChecklistsForListView({
        facilityId,
        page,
        size,
        sort: 'createdAt,desc',
        filters: JSON.stringify({
          op: FilterOperators.AND,
          fields: [
            ...filters,
            ...searchFilterFields,
            {
              field: 'useCaseId',
              op: FilterOperators.EQ,
              values: [selectedUseCase?.id],
            },
            ...(facilityId === ALL_FACILITY_ID
              ? [
                  {
                    field: 'isGlobal',
                    op: FilterOperators.EQ,
                    values: [true],
                  },
                ]
              : label === 'prototype'
              ? [
                  {
                    field: 'isGlobal',
                    op: FilterOperators.EQ,
                    values: [false],
                  },
                ]
              : []),
          ],
        }),
      }),
    );
  };

  useEffect(() => {
    dispatch(clearData());
  }, []);

  useEffect(() => {
    fetchData({ filters: filterFields });
  }, [filterFields, searchFilterFields]);

  const prototypeActionsTemplate = (item: Checklist | null = null) => {
    if (!item) return <div style={{ display: 'flex', justifyContent: 'center' }}>-N/A-</div>;

    return (
      <div
        id="archive-unarchive"
        onClick={() => {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle: item.archived ? 'Unarchive Protoype' : 'Archive Protoype',
                modalDesc: `Provide details for ${
                  item.archived ? 'unarchiving' : 'archiving'
                } the prototype`,
                onSubmitHandler: (reason: string, setFormErrors: (errors?: Error[]) => void) =>
                  item.archived
                    ? dispatch(unarchiveChecklist(item.id, reason, setFormErrors))
                    : dispatch(archiveChecklist(item.id, reason, setFormErrors)),
                onSubmitModalText: item.archived ? 'Unarchive' : 'Archive',
              },
            }),
          );
        }}
      >
        <MemoArchive style={{ marginRight: '8px' }} />
        {item.archived ? 'Unarchive' : 'Archive'}
      </div>
    );
  };

  const checkArchiveAndRevisionPermission = (action: 'archive' | 'revision') => {
    if (selectedChecklist?.global) {
      if (facilityId === ALL_FACILITY_ID) return true;
    } else if (checkPermission(['checklists', action])) {
      return true;
    }
    return false;
  };

  const checkStartPrototypePermission = () => {
    if (facilityId === ALL_FACILITY_ID) {
      return checkPermission(['checklists', 'createGlobal']);
    }
    return checkPermission(['checklists', 'create']);
  };

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

  const columns = [
    ...(label === 'prototype'
      ? [
          {
            id: 'state',
            label: 'State',
            minWidth: 166,
            format: function renderComp(item: Checklist) {
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FiberManualRecord
                    className="icon"
                    style={{ color: ChecklistStatesColors[item.state] }}
                  />
                  <span title={ChecklistStatesContent[item.state]}>
                    {ChecklistStatesContent[item.state]}
                  </span>
                </div>
              );
            },
          },
        ]
      : []),
    {
      id: 'name',
      label: 'Name',
      minWidth: 240,
      format: function renderComp(item: Checklist) {
        return (
          <span className="primary" onClick={() => selectChecklist(item.id)} title={item.name}>
            {item.name}
          </span>
        );
      },
    },
    {
      id: 'isGlobal',
      label: 'Local/Global',
      minWidth: 100,
      format: function renderComp(item: Checklist) {
        const tagTitle = item?.global ? 'Global' : 'Local';
        return (
          <span title={tagTitle}>
            <TypeChip
              label={tagTitle}
              $backGroundColor={item?.global ? '#d0e2ff' : '#a7f0ba'}
              $fontColor={item?.global ? '#0043ce' : '#0e6027'}
            />
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
    ...checklistProperties.map((checklistProperty) => {
      return {
        id: checklistProperty.id,
        label: checklistProperty.label,
        minWidth: 125,
        maxWidth: 180,
      };
    }),
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      format: function renderComp(item: Checklist) {
        if (label === 'published') {
          return (
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {!item.archived && checkPermission(['checklists', 'createJob']) && (
                <div
                  className="primary"
                  onClick={async () => {
                    handleOnCreateJob(item);
                  }}
                >
                  <span>Create Job</span>
                </div>
              )}
              <div
                id="more-actions"
                onClick={(event: MouseEvent<HTMLDivElement>) => {
                  setAnchorEl(event.currentTarget);
                  setSelectedChecklist(item);
                }}
              >
                More <ArrowDropDown className="icon" />
              </div>

              <ListActionMenu
                id="row-more-actions"
                anchorEl={anchorEl}
                keepMounted
                disableEnforceFocus
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.CHECKLIST_INFO,
                        props: { checklistId: selectedChecklist?.id },
                      }),
                    );
                  }}
                >
                  <div className="list-item">
                    <MemoViewInfo />
                    <span>View Info</span>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/checklists/jobs`, {
                      state: {
                        processFilter: {
                          processName: selectedChecklist?.name,
                          id: selectedChecklist?.id,
                        },
                      },
                    })
                  }
                >
                  <div className="list-item">
                    <MemoViewInfo />
                    <span>View Jobs</span>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/checklists/${selectedChecklist?.id}/scheduler`, {
                      state: {
                        processFilter: {
                          processName: selectedChecklist?.name,
                          id: selectedChecklist?.id,
                        },
                      },
                    })
                  }
                >
                  <div className="list-item">
                    <TimelineOutlinedIcon />
                    <span>Scheduler</span>
                  </div>
                </MenuItem>
                {checkPermission(['checklists', 'importExport']) && (
                  <MenuItem
                    onClick={() => {
                      if (selectedChecklist?.id) {
                        dispatch(exportChecklist({ checklistId: selectedChecklist.id }));
                      }
                    }}
                  >
                    <div className="list-item">
                      <PublishOutlinedIcon />
                      <span>Export</span>
                    </div>
                  </MenuItem>
                )}
                {!item.archived && checkArchiveAndRevisionPermission('revision') && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      if (selectedChecklist?.id)
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                            props: {
                              header: 'Start Revision',
                              body: (
                                <>
                                  <span>
                                    Are you sure you want to start a Revision on this Process ?
                                  </span>
                                  <span style={{ color: '#999999' }}>
                                    This will Deprecate the current Process and create a new
                                    Prototype as a revision.
                                  </span>
                                </>
                              ),
                              onPrimaryClick: () =>
                                dispatch(
                                  addRevisionPrototype(
                                    selectedChecklist?.id,
                                    selectedChecklist?.code,
                                    selectedChecklist?.name,
                                  ),
                                ),
                            },
                          }),
                        );
                    }}
                  >
                    <div className="list-item">
                      <MemoStartRevision />
                      <span>Start a Revision</span>
                    </div>
                  </MenuItem>
                )}
                {checkArchiveAndRevisionPermission('archive') && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      if (selectedChecklist?.id)
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.REASON_MODAL,
                            props: {
                              modalTitle: selectedChecklist?.archived
                                ? 'Unarchive Process'
                                : 'Archive Process',
                              modalDesc: `Provide details for ${
                                selectedChecklist?.archived ? 'unarchiving' : 'archiving'
                              } the process`,
                              onSubmitHandler: (
                                reason: string,
                                setFormErrors: (errors?: Error[]) => void,
                              ) => {
                                selectedChecklist?.archived
                                  ? dispatch(
                                      unarchiveChecklist(
                                        selectedChecklist?.id,
                                        reason,
                                        setFormErrors,
                                      ),
                                    )
                                  : dispatch(
                                      archiveChecklist(selectedChecklist.id, reason, setFormErrors),
                                    );
                              },
                              onSubmitModalText: selectedChecklist?.archived
                                ? 'Unarchive'
                                : 'Archive',
                            },
                          }),
                        );
                    }}
                  >
                    <div className="list-item">
                      <MemoArchive />
                      <span>
                        {selectedChecklist?.archived ? 'Unarchive Process' : 'Archive Process'}
                      </span>
                    </div>
                  </MenuItem>
                )}
                {facilityId !== ALL_FACILITY_ID
                  ? [
                      <MenuItem
                        key={item.id + '-job-logs'}
                        onClick={() => navigate(`/checklists/${selectedChecklist?.id}/logs`)}
                      >
                        <div className="list-item">
                          <MemoViewInfo />
                          <span>View Job Logs</span>
                        </div>
                      </MenuItem>,
                      <MenuItem
                        key={item.id + '-trained-users'}
                        onClick={() => navigate(`/checklists/${selectedChecklist?.id}/assignment`)}
                      >
                        <div className="list-item">
                          <MemoViewInfo />
                          <span>Trained Users</span>
                        </div>
                      </MenuItem>,
                    ]
                  : !item.archived && (
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          dispatch(
                            openOverlayAction({
                              type: OverlayNames.PROCESS_SHARING,
                              props: { checklistId: selectedChecklist?.id },
                            }),
                          );
                        }}
                      >
                        <div className="list-item">
                          <MemoViewInfo />
                          <span>Sharing with Units</span>
                        </div>
                      </MenuItem>
                    )}
              </ListActionMenu>
            </div>
          );
        } else {
          if (
            item?.audit?.createdBy?.id === userId ||
            checkPermission(['checklists', 'archivePrototype'])
          ) {
            return prototypeActionsTemplate(item);
          }
          return prototypeActionsTemplate();
        }
      },
    },
    ...(label === 'published' && currentPageData.some((item) => item.state === 'BEING_REVISED')
      ? [
          {
            id: 'revised',
            label: '',
            minWidth: 240,
            format: function renderComp(item: Checklist) {
              if (item.state === 'BEING_REVISED') {
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FiberManualRecord
                      className="icon"
                      style={{
                        color: ChecklistStatesColors[item.state],
                      }}
                    />
                    {ChecklistStatesContent[item.state]}
                  </div>
                );
              } else {
                return <div />;
              }
            },
          },
        ]
      : []),
  ];

  const onApplyMoreFilters = (filters: any) => {
    const stateFilter = filters?.find((filter: any) => filter?.field === 'state');
    const collaboratorFilter = filters?.find((filter: any) => filter?.field !== 'state');
    setFilterFields((currentFields) => [
      ...currentFields.filter((field) => field?.field !== 'state'),
      ...(stateFilter?.values
        ? [
            {
              id: stateFilter?.id,
              field: 'state',
              op: stateFilter?.values?.[0] === 'all' ? FilterOperators.NE : FilterOperators.EQ,
              values: [
                stateFilter.values?.[0] === 'all' ? 'PUBLISHED' : `${stateFilter?.values[0]}`,
              ],
            },
          ]
        : getBaseFilter(label).filter((field) => field?.field === 'state')),
    ]);

    setFilterFields((currentFields) => [
      ...currentFields.filter(
        (field) =>
          field?.field !== 'collaborators.type' &&
          field?.field !== 'collaborators.user.id' &&
          field?.field !== 'not.a.collaborator',
      ),
      ...(collaboratorFilter?.id
        ? collaboratorFilter?.values?.[0] === CollaboratorType.AUTHOR
          ? [
              {
                field: 'collaborators.user.id',
                op: FilterOperators.EQ,
                values: [userId],
              },
              {
                id: collaboratorFilter.id,
                field: 'collaborators.type',
                op: FilterOperators.ANY,
                values: [CollaboratorType.AUTHOR, CollaboratorType.PRIMARY_AUTHOR],
              },
            ]
          : collaboratorFilter?.values?.[0] === CollaboratorType.REVIEWER
          ? [
              {
                field: 'collaborators.user.id',
                op: FilterOperators.EQ,
                values: [userId],
              },
              {
                id: collaboratorFilter.id,
                field: 'collaborators.type',
                op: FilterOperators.ANY,
                values: [CollaboratorType.REVIEWER],
              },
              ,
            ]
          : [
              {
                id: collaboratorFilter.id,
                field: 'not.a.collaborator',
                op: FilterOperators.NE,
                values: [userId],
              },
            ]
        : []),
    ]);
  };

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          label={label}
          showDropdown
          style={{ maxWidth: 'unset' }}
          dropdownOptions={[
            {
              label: 'Process Name',
              value: 'name',
              field: 'name',
              operator: FilterOperators.LIKE,
            },
            {
              label: 'Process ID',
              value: 'code',
              field: 'code',
              operator: FilterOperators.LIKE,
            },
          ]}
          updateFilterFields={(fields) => setSearchFilterFields(fields)}
        />

        {label === 'prototype' && (
          <div className="filter-buttons-wrapper" onClick={() => setPrototypeFilterDrawer(true)}>
            <img className="icon" src={FilterIcon} alt="filter icon" />
            {filterFields.filter((field) => field?.hasOwnProperty('id')).length > 0 && (
              <span>{`(${
                filterFields.filter((field) => field?.hasOwnProperty('id')).length
              })`}</span>
            )}
          </div>
        )}

        <ToggleSwitch
          checkedIcon={false}
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
          uncheckedIcon={false}
        />

        {label === 'prototype' && checkPermission(['checklists', 'importExport']) && (
          <ImageUploadButton
            icon={GetAppOutlinedIcon}
            label="Import"
            onUploadSuccess={() => {
              dispatch(
                showNotification({
                  type: NotificationType.SUCCESS,
                  msg: 'Process Imported',
                }),
              );
            }}
            onUploadError={(error) => {
              dispatch(
                showNotification({
                  type: NotificationType.ERROR,
                  msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
                }),
              );
            }}
            apiCall={apiImportChecklist}
            acceptedTypes={['.json']}
            useCaseId={selectedUseCase!.id}
          />
        )}
        {checkStartPrototypePermission() && (
          <Button
            id="create"
            onClick={() => {
              navigate('/checklists/prototype', {
                state: { mode: FormMode.ADD },
              });
            }}
          >
            Start a Prototype
          </Button>
        )}
      </div>
      <div
        style={{
          display: checklistDataLoading || checklistPropertiesLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
      </div>
      <div
        style={{
          ...(checklistDataLoading || checklistPropertiesLoading
            ? { display: 'none' }
            : { display: 'contents' }),
        }}
      >
        <DataTable
          columns={columns}
          rows={currentPageData.map((item) => {
            return {
              ...item,
              ...item.properties.reduce<Record<string, string>>((obj, checklistProperty) => {
                obj[checklistProperty.id] = checklistProperty.value;
                return obj;
              }, {}),
            };
          })}
          emptyTitle="No Processes Found"
        />

        <Pagination pageable={pageable} fetchData={fetchData} />
      </div>
      {createJobDrawerVisible && selectedChecklist && (
        <CreateJob
          checklist={{ label: selectedChecklist.name, value: selectedChecklist.id }}
          onCloseDrawer={setCreateJobDrawerVisible}
        />
      )}
      {showPrototypeFilterDrawer && (
        <FiltersDrawer
          setState={setPrototypeFilterDrawer}
          onApplyMoreFilters={onApplyMoreFilters}
          filters={filterFields.filter((field) => field?.hasOwnProperty('id'))}
        />
      )}
    </TabContentWrapper>
  );
};

export default ListView;
