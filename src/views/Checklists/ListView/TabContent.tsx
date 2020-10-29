import { ListViewComponent } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DisabledStates } from '#Composer-new/checklist.types';
import { ComposerEntity } from '#Composer-new/types';
import { useProperties } from '#services/properties';
import { useTypedSelector } from '#store';
import { createJob } from '#views/Jobs/ListView/actions';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Settings } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FormMode } from '../NewPrototype/types';
import { Checklist } from '../types';
import { fetchChecklists } from './actions';
import { Composer } from './styles';
import { ListViewProps } from './types';

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

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'status',
          op: label === 'Published' ? 'EQ' : 'NE',
          values: [DisabledStates.PUBLISHED],
        },
        { field: 'archived', op: 'EQ', values: [false] },
      ],
    });
    dispatch(fetchChecklists({ page, size, filters, sort: 'createdAt,desc' }));
  };

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
      <ListViewComponent
        properties={checklistProperties}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={checklists}
        primaryButtonText="Create Checklist"
        onPrimaryClick={() =>
          navigate('prototype', { state: { mode: FormMode.ADD } })
        }
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
                      <Settings
                        style={{
                          fontSize: '20px',
                          color: '#1d84ff',
                          width: '36px',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        className="list-title"
                        onClick={() => selectChecklist(item.id)}
                      >
                        {item.name}
                      </span>
                    </div>
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
                          console.log('archive published prototype');
                        }}
                      >
                        Archive
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
                        console.log('Unarchive');
                      } else {
                        console.log('archive');
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
