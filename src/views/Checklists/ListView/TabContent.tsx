import {
  Checklist,
  ChecklistStatesColors,
  ChecklistStatesContent,
  DisabledStates,
} from '#PrototypeComposer/checklist.types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import MemoArchive from '#assets/svg/Archive';
import MemoStartRevision from '#assets/svg/StartRevision';
import MemoViewInfo from '#assets/svg/ViewInfo';
import {
  Button,
  DataTable,
  DropdownFilter,
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
import CreateJob from '#views/Jobs/Components/CreateJob';
import { Error, fetchDataParams, FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Chip, CircularProgress, MenuItem } from '@material-ui/core';
import { ArrowDropDown, FiberManualRecord } from '@material-ui/icons';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addRevisionPrototype } from '../NewPrototype/actions';
import { FormMode } from '../NewPrototype/types';
import {
  archiveChecklist,
  clearData,
  exportChecklist,
  fetchChecklistsForListView,
  unarchiveChecklist,
} from './actions';
import { ListViewProps } from './types';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import permissionsIcon from '#assets/svg/permissionsIcon.svg';

const getBaseFilter = (label: string): FilterField[] => [
  {
    field: 'state',
    op: label === 'published' ? FilterOperators.EQ : FilterOperators.NE,
    values: [DisabledStates.PUBLISHED],
  },
  { field: 'archived', op: FilterOperators.EQ, values: [false] },
  ...(label === 'prototype'
    ? ([
        {
          field: 'state',
          op: FilterOperators.NE,
          values: [DisabledStates.DEPRECATED],
        },
      ] as FilterField[])
    : []),
];

const TypeChip = styled(Chip)<{ fontColor: string; backGroundColor: string }>`
  height: 24px !important;
  background-color: ${({ backGroundColor }) => backGroundColor} !important;
  color: ${({ fontColor }) => fontColor} !important;
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
              backGroundColor={item?.global ? '#d0e2ff' : '#a7f0ba'}
              fontColor={item?.global ? '#0043ce' : '#0e6027'}
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
                {/* <MenuItem
                  onClick={() =>
                    navigate(`/checklists/${selectedChecklist?.id}/permissions`, {
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
                    <img src={permissionsIcon} alt="permission-icon" />
                    <span>Permissions</span>
                  </div>
                </MenuItem> */}
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
                {facilityId !== ALL_FACILITY_ID ? (
                  <>
                    <MenuItem onClick={() => navigate(`/checklists/${selectedChecklist?.id}/logs`)}>
                      <div className="list-item">
                        <MemoViewInfo />
                        <span>View Job Logs</span>
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate(`/checklists/${selectedChecklist?.id}/assignment`)}
                    >
                      <div className="list-item">
                        <MemoViewInfo />
                        <span>Trained Users</span>
                      </div>
                    </MenuItem>
                  </>
                ) : (
                  !item.archived && (
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
                  )
                )}
              </ListActionMenu>
            </div>
          );
        } else {
          if (item?.audit?.createdBy?.id === userId || checkPermission(['checklists', 'archive'])) {
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
          <DropdownFilter
            label="Prototype State is"
            options={[
              { label: 'All', value: 'all' },
              ...Object.keys(ChecklistStatesContent)
                .filter((key) => key !== 'PUBLISHED')
                .map((key) => ({
                  label: ChecklistStatesContent[key as keyof typeof ChecklistStatesContent],
                  value: key,
                })),
            ]}
            updateFilter={(option) =>
              setFilterFields((currentFields) => {
                const updatedFilterFields = currentFields.map((field) => ({
                  ...field,
                  ...(field.field === 'state'
                    ? {
                        op: option.value === 'all' ? FilterOperators.NE : FilterOperators.EQ,
                        values: [option.value === 'all' ? 'PUBLISHED' : option.value],
                      }
                    : { values: field.values }),
                })) as FilterField[];
                return updatedFilterFields;
              })
            }
          />
        )}

        {label === 'prototype' && (
          <DropdownFilter
            label="I am involved as"
            options={[
              { label: 'Any', value: 'any' },
              { label: 'As Author', value: 'collaborators.type' },
              { label: 'As Collaborator', value: 'collaborators.user.id' },
              { label: 'Not Involved', value: 'not.a.collaborator' },
            ]}
            updateFilter={(option) => {
              if (option.value === 'any') {
                setFilterFields((currentFields) => {
                  const updatedFilterFields = currentFields.filter(
                    (field) =>
                      field.field !== 'collaborators.type' &&
                      field.field !== 'collaborators.user.id' &&
                      field.field !== 'not.a.collaborator',
                  );
                  return updatedFilterFields;
                });
              } else if (option.value === 'not.a.collaborator') {
                setFilterFields((currentFields) => {
                  const updatedFilterFields = [
                    ...currentFields.filter(
                      (field) =>
                        field.field !== 'collaborators.type' &&
                        field.field !== 'collaborators.user.id',
                    ),
                    {
                      field: 'not.a.collaborator',
                      op: FilterOperators.NE,
                      values: [userId],
                    },
                  ] as FilterField[];
                  return updatedFilterFields;
                });
              } else if (option.value === 'collaborators.type') {
                setFilterFields((currentFields) => {
                  const updatedFilterFields = [
                    ...currentFields.filter((field) => field.field !== 'not.a.collaborator'),
                    {
                      field: 'collaborators.user.id',
                      op: FilterOperators.EQ,
                      values: [userId],
                    },
                    {
                      field: 'collaborators.type',
                      op: FilterOperators.ANY,
                      values: [CollaboratorType.AUTHOR, CollaboratorType.PRIMARY_AUTHOR],
                    },
                  ] as FilterField[];
                  return updatedFilterFields;
                });
              } else {
                setFilterFields((currentFields) => {
                  const updatedFilterFields = [
                    ...currentFields.filter(
                      (field) =>
                        field.field !== 'collaborators.type' &&
                        field.field !== 'collaborators.user.id' &&
                        field.field !== 'not.a.collaborator',
                    ),
                    {
                      field: option.value,
                      op: FilterOperators.EQ,
                      values: [userId],
                    },
                    {
                      field: 'collaborators.type',
                      op: FilterOperators.ANY,
                      values: [CollaboratorType.REVIEWER],
                    },
                  ] as FilterField[];
                  return updatedFilterFields;
                });
              }
            }}
          />
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
    </TabContentWrapper>
  );
};

export default ListView;
