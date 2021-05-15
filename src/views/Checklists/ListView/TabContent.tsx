import MemoArchive from '#assets/svg/Archive';
import MemoCreateJob from '#assets/svg/CreateJob';
import MemoStartRevision from '#assets/svg/StartRevision';
import MemoViewInfo from '#assets/svg/ViewInfo';
import {
  Button1,
  DropdownFilter,
  ExtraColumn,
  NewListView,
  SearchFilter,
  ToggleSwitch,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  ChecklistStatesColors,
  ChecklistStatesContent,
  DisabledStates,
} from '#PrototypeComposer/checklist.types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useProperties } from '#services/properties';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { createJob } from '#views/Jobs/NewListView/actions';
import { TabContentWrapper } from '#views/Jobs/NewListView/styles';
import { Menu, MenuItem } from '@material-ui/core';
import {
  ArrowDropDown,
  ArrowLeft,
  ArrowRight,
  FiberManualRecord,
} from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addRevisionPrototype } from '../NewPrototype/actions';
import { FormMode } from '../NewPrototype/types';
import { Checklist } from '../types';
import {
  archiveChecklist,
  clearData,
  fetchChecklistsForListView,
  unarchiveChecklist,
} from './actions';
import { ListViewProps } from './types';

const getBaseFilter = (label: string): FilterField[] => [
  {
    field: 'state',
    op: label === 'published' ? 'EQ' : 'NE',
    values: [DisabledStates.PUBLISHED],
  },
  { field: 'archived', op: 'EQ', values: [false] },
  ...(label === 'prototype'
    ? [
        {
          field: 'state',
          op: 'NE',
          values: [DisabledStates.DEPRECATED],
        },
      ]
    : []),
];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 0;

const ListView: FC<ListViewProps & { label: string }> = ({
  navigate = navigateTo,
  label,
}) => {
  const {
    checklistListView: { checklists, pageable, currentPageData },
    auth: { userId },
  } = useTypedSelector((state) => state);
  const { selectedFacility: { id: facilityId } = {} } = useTypedSelector(
    (state) => state.auth,
  );

  const { list: jobProperties } = useProperties(ComposerEntity.JOB);
  const { list: checklistProperties } = useProperties(ComposerEntity.CHECKLIST);

  const dispatch = useDispatch();

  const selectChecklist = (id: string | number) =>
    navigate(`/checklists/${id}`);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedChecklist(null);
  };

  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null,
  );

  const [filterFields, setFilterFields] = useState<FilterField[]>(
    getBaseFilter(label),
  );

  const [pageData, setPageData] = useState({
    start: pageable.page * pageable.pageSize,
    end: pageable.page * pageable.pageSize + pageable.pageSize,
  });

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({ op: 'AND', fields: filterFields });
    dispatch(
      fetchChecklistsForListView(
        { facilityId, page, size, filters, sort: 'createdAt,desc' },
        true,
      ),
    );
  };

  useEffect(() => {
    dispatch(clearData());
    setFilterFields(getBaseFilter(label));
  }, [label]);

  useEffect(() => {
    dispatch(
      fetchChecklistsForListView(
        {
          filters: JSON.stringify({ op: 'AND', fields: filterFields }),
          page: 0,
          size: 0,
          sort: 'createdAt,desc',
          facilityId,
        },
        false,
      ),
    );
  }, [filterFields]);

  useEffect(() => {
    fetchData(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE);
  }, []);

  useEffect(() => {
    setPageData({
      start: pageable.page * pageable.pageSize,
      end: pageable.page * pageable.pageSize + pageable.pageSize,
    });
  }, [pageable]);

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: string; value: string }[] = [];
    let error = false;
    jobProperties.every((property) => {
      if (property.name) {
        if (!jobDetails[property.name]) {
          if (property.mandatory) {
            error = true;
            return false;
          }
        } else {
          tempProperties.push({
            id: property.id,
            value: jobDetails[property.name],
          });
          return true;
        }
      }
    });
    if (!error && tempProperties && selectedChecklist) {
      const parsedProperties: { id: string; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
          checklistId: selectedChecklist.id,
        }),
      );
    }
  };

  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <TabContentWrapper>
      <div
        style={{
          padding: '0 0 8px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <SearchFilter
          showdropdown
          dropdownOptions={[
            {
              label: 'Checklist Name',
              value: 'name',
              field: 'name',
              operator: 'LIKE',
            },
            ...checklistProperties.map(({ placeHolder, id }) => ({
              label: placeHolder,
              value: id,
              field: 'checklistPropertyValues.propertiesId',
              operator: 'EQ',
            })),
          ]}
          updateFilterFields={(fields) => {
            setFilterFields((currentFields) => [
              ...currentFields.filter(
                (field) =>
                  !fields.some((newField) => newField.field === field.field),
              ),
              ...fields,
            ]);
          }}
        />

        {label === 'prototype' ? (
          <DropdownFilter
            label="Prototype State is"
            options={[
              { label: 'All', value: 'all' },
              ...Object.keys(ChecklistStatesContent)
                .filter((key) => key !== 'PUBLISHED')
                .map((key) => ({
                  label: ChecklistStatesContent[key],
                  value: key,
                })),
            ]}
            updateFilter={(option) =>
              setFilterFields((currentFields) =>
                currentFields.map((field) => ({
                  ...field,
                  ...(field.field === 'state'
                    ? {
                        op: option.value === 'all' ? 'NE' : 'EQ',
                        values: [
                          option.value === 'all' ? 'PUBLISHED' : option.value,
                        ],
                      }
                    : { values: field.values }),
                })),
              )
            }
          />
        ) : null}

        {label === 'prototype' ? (
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
                setFilterFields((currentFields) =>
                  currentFields.filter(
                    (field) =>
                      field.field !== 'collaborators.type' &&
                      field.field !== 'collaborators.user.id' &&
                      field.field !== 'not.a.collaborator',
                  ),
                );
              } else if (option.value === 'not.a.collaborator') {
                setFilterFields(
                  (currentFields) =>
                    [
                      ...currentFields.filter(
                        (field) =>
                          field.field !== 'collaborators.type' &&
                          field.field !== 'collaborators.user.id',
                      ),
                      {
                        field: 'not.a.collaborator',
                        op: 'NE',
                        values: [userId],
                      },
                    ] as FilterField[],
                );
              } else if (option.value === 'collaborators.type') {
                setFilterFields(
                  (currentFields) =>
                    [
                      ...currentFields.filter(
                        (field) => field.field !== 'not.a.collaborator',
                      ),
                      {
                        field: 'collaborators.user.id',
                        op: 'EQ',
                        values: [userId],
                      },
                      {
                        field: 'collaborators.type',
                        op: 'ANY',
                        values: [
                          CollaboratorType.AUTHOR,
                          CollaboratorType.PRIMARY_AUTHOR,
                        ],
                      },
                    ] as FilterField[],
                );
              } else {
                setFilterFields(
                  (currentFields) =>
                    [
                      ...currentFields.filter(
                        (field) =>
                          field.field !== 'collaborators.type' &&
                          field.field !== 'collaborators.user.id' &&
                          field.field !== 'not.a.collaborator',
                      ),
                      { field: option.value, op: 'EQ', values: [userId] },
                    ] as FilterField[],
                );
              }
            }}
          />
        ) : null}

        <ToggleSwitch
          checkedIcon={false}
          offLabel="Show Archived"
          onLabel="Showing Archived"
          value={
            !!filterFields.find((field) => field.field === 'archived')
              ?.values[0]
          }
          onChange={(isChecked) =>
            setFilterFields((currentFields) =>
              currentFields.map((field) => ({
                ...field,
                ...(field.field === 'archived'
                  ? { values: [isChecked] }
                  : { values: field.values }),
              })),
            )
          }
          uncheckedIcon={false}
        />

        {checkPermission(['checklists', 'create']) && (
          <Button1
            id="create"
            onClick={() =>
              navigate('/checklists/prototype', {
                state: { mode: FormMode.ADD },
              })
            }
          >
            Start a Prototype
          </Button1>
        )}
      </div>
      <NewListView
        properties={checklistProperties}
        data={currentPageData}
        beforeColumns={
          [
            ...(label === 'prototype'
              ? [
                  {
                    header: 'State',
                    template: function renderComp(item: Checklist) {
                      return (
                        <div className="list-card-columns" key={item.id}>
                          <FiberManualRecord
                            className="icon"
                            style={{ color: ChecklistStatesColors[item.state] }}
                          />
                          {ChecklistStatesContent[item.state]}
                        </div>
                      );
                    },
                  },
                ]
              : []),
            {
              header: 'Name',
              template: function renderComp(item: Checklist) {
                return (
                  <div className="list-card-columns" key={`name_${item.code}`}>
                    <span
                      className="list-title"
                      onClick={() => selectChecklist(item.id)}
                    >
                      {item.name}
                    </span>
                  </div>
                );
              },
            },
          ] as ExtraColumn[]
        }
        afterColumns={
          [
            {
              header: 'Checklist ID',
              template: function renderComp(item: Checklist) {
                return (
                  <div className="list-card-columns" key={item.id}>
                    {item.code}
                  </div>
                );
              },
            },
            {
              header: '',
              template: function renderComp(item: Checklist) {
                if (label === 'published') {
                  return (
                    <>
                      <div
                        className="list-card-columns"
                        id="more-actions"
                        onClick={(event: MouseEvent<HTMLDivElement>) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedChecklist(item);
                        }}
                      >
                        More <ArrowDropDown className="icon" />
                      </div>

                      <Menu
                        id="row-more-actions"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        style={{ marginTop: 40 }}
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
                          onClick={() => {
                            handleClose();
                            dispatch(
                              openOverlayAction({
                                type: OverlayNames.CREATE_JOB_MODAL,
                                props: {
                                  selectedChecklist: selectedChecklist,
                                  properties: jobProperties,
                                  onCreateJob: onCreateJob,
                                },
                              }),
                            );
                          }}
                        >
                          <div className="list-item">
                            <MemoCreateJob />
                            <span>Create Job</span>
                          </div>
                        </MenuItem>
                        {checkPermission(['checklists', 'revision']) && (
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              if (selectedChecklist?.id)
                                dispatch(
                                  openOverlayAction({
                                    type:
                                      OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                                    props: {
                                      header: 'Start Revision',
                                      body: (
                                        <>
                                          <span>
                                            Are you sure you want to start a
                                            Revision on this Checklist ?
                                          </span>
                                          <span style={{ color: '#999999' }}>
                                            This will Deprecate the current
                                            Checklist and create a new Prototype
                                            as a revision.
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
                        {checkPermission(['checklists', 'archive']) && (
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              if (selectedChecklist?.id)
                                dispatch(
                                  openOverlayAction({
                                    type:
                                      OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                                    props: {
                                      header: selectedChecklist?.archived
                                        ? 'Unarchive Checklist'
                                        : 'Archive Checklist',
                                      body: (
                                        <span>
                                          Are you sure you want to{' '}
                                          {selectedChecklist?.archived
                                            ? 'Unarchive'
                                            : 'Archive'}
                                          this Prototype ?
                                        </span>
                                      ),
                                      onPrimaryClick: () => {
                                        if (selectedChecklist?.archived) {
                                          dispatch(
                                            unarchiveChecklist(
                                              selectedChecklist?.id,
                                              true,
                                            ),
                                          );
                                        } else {
                                          dispatch(
                                            archiveChecklist(
                                              selectedChecklist.id,
                                              true,
                                            ),
                                          );
                                        }
                                      },
                                    },
                                  }),
                                );
                            }}
                          >
                            <div className="list-item">
                              <MemoArchive />
                              <span>
                                {selectedChecklist?.archived
                                  ? 'Unarchive Checklist'
                                  : 'Archive Checklist'}
                              </span>
                            </div>
                          </MenuItem>
                        )}
                      </Menu>
                    </>
                  );
                } else {
                  if (!checkPermission(['checklists', 'archive']))
                    return (
                      <div
                        className="list-card-columns"
                        id="archive-unarchive"
                      />
                    );
                  return (
                    <div
                      id="archive-unarchive"
                      className="list-card-columns"
                      onClick={() => {
                        if (item.archived) {
                          dispatch(
                            openOverlayAction({
                              type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                              props: {
                                header: 'Unarchive Prototype',
                                body: (
                                  <span>
                                    Are you sure you want to Unarchive this
                                    Prototype ?
                                  </span>
                                ),
                                onPrimaryClick: () =>
                                  dispatch(unarchiveChecklist(item.id)),
                              },
                            }),
                          );
                        } else {
                          dispatch(
                            openOverlayAction({
                              type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                              props: {
                                header: 'Archive Prototype',
                                body: (
                                  <span>
                                    Are you sure you want to Archive this
                                    Prototype ?
                                  </span>
                                ),
                                onPrimaryClick: () =>
                                  dispatch(archiveChecklist(item.id)),
                              },
                            }),
                          );
                        }
                      }}
                    >
                      <MemoArchive style={{ marginRight: '8px' }} />
                      {item.archived ? 'Unarchive' : 'Archive'}
                    </div>
                  );
                }
              },
            },
            ...(label === 'published'
              ? [
                  {
                    header: '',
                    template: function renderComp(item: Checklist) {
                      if (item.state === 'BEING_REVISED') {
                        return (
                          <div className="list-card-columns">
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
                        return <div className="list-card-columns"></div>;
                      }
                    },
                  },
                ]
              : []),
          ] as ExtraColumn[]
        }
      />

      <div className="pagination">
        <ArrowLeft
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page > 0) {
              fetchData(pageable.page - 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
        {Array.from({ length: pageable.totalPages }, (_, i) => i)
          .slice(
            Math.floor(pageable.page / 10) * 10,
            Math.floor(pageable.page / 10) * 10 + 10,
          )
          .map((el) => (
            <span
              key={el}
              className={pageable.page === el ? 'active' : ''}
              onClick={() => fetchData(el, DEFAULT_PAGE_SIZE)}
            >
              {el + 1}
            </span>
          ))}
        <ArrowRight
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page < pageable.totalPages - 1) {
              fetchData(pageable.page + 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
      </div>
    </TabContentWrapper>
  );
};

export default ListView;
