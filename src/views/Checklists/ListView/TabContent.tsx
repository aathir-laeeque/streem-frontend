import {
  ListViewComponent,
  SearchFilter,
  Button1,
  ArchiveToggleFilter,
  DropdownFilter,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  ChecklistStatesColors,
  ChecklistStatesContent,
  DisabledStates,
} from '#Composer-new/checklist.types';
import { ComposerEntity } from '#Composer-new/types';
import { useProperties } from '#services/properties';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { createJob } from '#views/Jobs/ListView/actions';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, FiberManualRecord } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FormMode } from '../NewPrototype/types';
import { Checklist } from '../types';
import {
  archiveChecklist,
  fetchChecklists,
  unarchiveChecklist,
} from './actions';
import { Composer } from './styles';
import { ListViewProps } from './types';
import { AllChecklistStates } from '#Composer-new/checklist.types';
import { addRevisionPrototype } from '../NewPrototype/actions';

const getBaseFilter = (label: string) => [
  {
    field: 'state',
    op: label === 'Published' ? 'EQ' : 'NE',
    values: [DisabledStates.PUBLISHED],
  },
  { field: 'archived', op: 'EQ', values: [false] },
];

const ListView: FC<ListViewProps & { label: string }> = ({
  navigate = navigateTo,
  label,
}) => {
  const { checklists, pageable, loading } = useTypedSelector(
    (state) => state.checklistListView,
  );
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
      fetchData(0, 10);
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

  return (
    <Composer>
      <div style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
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
            setFilterFields((currentFields) => [
              ...currentFields.filter(
                (field) =>
                  !fields.some((newField) => newField.field === field.field),
              ),
              ...fields,
            ]);
          }}
        />

        {label === 'Prototype' ? (
          <DropdownFilter
            options={Object.keys(ChecklistStatesContent)
              .filter((key) => key !== 'PUBLISHED')
              .map((key) => ({
                label: ChecklistStatesContent[key],
                value: key,
              }))}
            updateFilter={(option) =>
              setFilterFields((currentFields) =>
                currentFields.map((field) => ({
                  ...field,
                  ...(field.field === 'state'
                    ? { op: 'EQ', values: [option.value] }
                    : { values: field.values }),
                })),
              )
            }
          />
        ) : null}

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

        <Button1
          id="create-prototype"
          onClick={() =>
            navigate('/checklists/prototype', { state: { mode: FormMode.ADD } })
          }
        >
          Create Checklist
        </Button1>
      </div>
      <ListViewComponent
        isSearchable={false}
        properties={checklistProperties}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={checklists}
        // primaryButtonText="Create Checklist"
        // onPrimaryClick={() =>
        //   navigate('/checklists/prototype', { state: { mode: FormMode.ADD } })
        // }
        beforeColumns={[
          {
            header: 'NAME',
            template: function renderComp(item: Checklist) {
              return (
                <div className="list-card-columns" key={`name_${item.code}`}>
                  <div className="title-group">
                    <span className="list-code">{item.code}</span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        className="list-title"
                        onClick={() => selectChecklist(item.id)}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="item-state"
                      style={{ color: ChecklistStatesColors[item?.state] }}
                    >
                      <FiberManualRecord className="icon" />
                      {ChecklistStatesContent[item?.state]}
                    </span>
                  </div>
                </div>
              );
            },
          },
        ]}
        afterColumns={[
          {
            header: '',
            template: function renderComp(item: Checklist) {
              if (label === 'Published') {
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
                              props: { checklist: item },
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
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          if (selectedChecklist?.id)
                            dispatch(
                              addRevisionPrototype(
                                selectedChecklist?.id.toString(),
                              ),
                            );
                        }}
                      >
                        Start a Revision
                      </MenuItem>
                    </Menu>
                  </>
                );
              } else {
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
                    {item.archived ? 'UnArchive' : 'Archive'}
                  </div>
                );
              }
            },
          },
        ]}
      />
    </Composer>
  );
};

export default ListView;
