import {
  ArchiveToggleFilter,
  Button1,
  DropdownFilter,
  NewListView,
  SearchFilter,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  ChecklistStatesContent,
  DisabledStates,
  ChecklistStatesColors,
} from '#Composer-new/checklist.types';
import { ComposerEntity } from '#Composer-new/types';
import { useProperties } from '#services/properties';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { createJob } from '#views/Jobs/ListView/actions';
import { Menu, MenuItem } from '@material-ui/core';
import checkPermission from '#services/uiPermissions';
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
  fetchChecklists,
  unarchiveChecklist,
} from './actions';
import { Composer } from './styles';
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
          values: [DisabledStates.STALE],
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
    checklistListView: { checklists, pageable, loading },
    auth: { userId },
  } = useTypedSelector((state) => state);
  const { isIdle } = useTypedSelector((state) => state.auth);

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

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({ op: 'AND', fields: filterFields });
    dispatch(
      fetchChecklists({ page, size, filters, sort: 'createdAt,desc' }, true),
    );
  };

  useEffect(() => {
    setFilterFields(getBaseFilter(label));
  }, [label]);

  useEffect(() => {
    dispatch(
      fetchChecklists(
        {
          filters: JSON.stringify({ op: 'AND', fields: filterFields }),
          page: 0,
          size: 0,
          sort: 'createdAt,desc',
        },
        false,
      ),
    );
  }, [filterFields]);

  useEffect(() => {
    if (!isIdle) {
      fetchData(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE);
    }
  }, [isIdle]);

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: number; value: string }[] = [];
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
      const parsedProperties: { id: number; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
          checklistId: selectedChecklist.id,
        }),
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <Composer>
      <div
        style={{
          padding: '0 0 16px',
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
            ...checklistProperties.map(({ placeHolder, name }) => ({
              label: placeHolder,
              value: name,
              field: 'checklistPropertyValues.property.name',
              operator: 'EQ',
            })),
          ]}
          updateFilterFields={(fields) => {
            console.log('fields :: ', fields);
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
              { label: 'As Author', value: 'authors.user.id' },
              { label: 'As Collaborator', value: 'collaborators.user.id' },
              { label: 'Not Involved', value: 'not_involved' },
            ]}
            updateFilter={(option) => {
              if (option.value === 'any') {
                setFilterFields((currentFields) =>
                  currentFields.filter(
                    (field) =>
                      field.field !== 'authors.user.id' &&
                      field.field !== 'collaborators.user.id',
                  ),
                );
              } else if (option.value === 'not_involved') {
                setFilterFields((currentFields) => [
                  ...currentFields.filter(
                    (field) =>
                      field.field !== 'authors.user.id' &&
                      field.field !== 'collaborators.user.id',
                  ),
                  { field: 'authors.user.id', op: 'NE', values: [userId] },
                  {
                    field: 'collaborators.user.id',
                    op: 'NE',
                    values: [userId],
                  },
                ]);
              } else {
                setFilterFields((currentFields) => [
                  ...currentFields.filter(
                    (field) =>
                      field.field !== 'authors.user.id' &&
                      field.field !== 'collaborators.user.id',
                  ),
                  { field: option.value, op: 'EQ', values: [userId] },
                ]);
              }
            }}
          />
        ) : null}

        {label === 'prototype' ? (
          <ArchiveToggleFilter
            value={
              !!filterFields.find((field) => field.field === 'archived')
                ?.values[0]
            }
            updateFilter={(isChecked) =>
              setFilterFields((currentFields) =>
                currentFields.map((field) => ({
                  ...field,
                  ...(field.field === 'archived'
                    ? { values: [isChecked] }
                    : { values: field.values }),
                })),
              )
            }
          />
        ) : null}

        {checkPermission(['checklists', 'create']) && (
          <Button1
            id="create-prototype"
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
        properties={checklistProperties.filter((el) => el.name !== 'TYPE')}
        data={checklists}
        beforeColumns={[
          ...(label === 'prototype'
            ? [
                {
                  header: 'State',
                  template: function renderComp(item: Checklist) {
                    return (
                      <div className="list-card-columns">
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
        ]}
        afterColumns={[
          {
            header: 'Checklist ID',
            template: function renderComp(item: Checklist) {
              return <div className="list-card-columns">{item.code}</div>;
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
                              props: { checklist: selectedChecklist },
                            }),
                          );
                        }}
                      >
                        View Info
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
                        Create Job
                      </MenuItem>
                      {checkPermission(['checklists', 'revision']) && (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            if (selectedChecklist?.id)
                              dispatch(
                                addRevisionPrototype(
                                  selectedChecklist?.id.toString(),
                                  selectedChecklist?.code.toString(),
                                  selectedChecklist?.name.toString(),
                                ),
                              );
                          }}
                        >
                          Start a Revision
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                );
              } else {
                if (!checkPermission(['checklists', 'archive']))
                  return (
                    <div className="list-card-columns" id="archive-unarchive" />
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
                    {item.archived ? 'Unarchive' : 'Archive'}
                  </div>
                );
              }
            },
          },
        ]}
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
        {Array.from(
          { length: Math.min(pageable.totalPages, 10) },
          (_, i) => i,
        ).map((el) => (
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
    </Composer>
  );
};

export default ListView;
