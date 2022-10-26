import { Button1, DataTable, TabContentProps, ToggleSwitch } from '#components';
import MemoArchive from '#assets/svg/Archive';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { InputTypes } from '#utils/globalTypes';
import { formatDateByInputType } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, ArrowLeft, ArrowRight } from '@material-ui/icons';
import { navigate, useLocation } from '@reach/router';
import React, { FC, useEffect, MouseEvent, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  archiveObject,
  fetchObjects,
  resetOntology,
  setActiveObject,
  unarchiveObject,
} from '../actions';
import { LoadingContainer } from '../ObjectTypes/ObjectTypeList';
import { Choice, Object, ObjectTypeProperty } from '../types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

const ObjectList: FC<TabContentProps> = ({ label }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    objectTypes: { active },
    objects: { list, listLoading, pageable },
  } = useTypedSelector((state) => state.ontology);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedObject, setSelectedObject] = useState<Object | null>(null);
  const [filters, setFilters] = useState<Record<string, string | number>>({
    usageStatus: 1,
  });
  const shouldFetch = useRef(true);
  const properties = active?.properties || [];
  const relations = active?.relations || [];

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedObject(null);
  };

  const fetchData = (page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE) => {
    dispatch(
      fetchObjects({
        page,
        size,
        collection: active?.externalId,
        ...filters,
      }),
    );
  };

  const showPaginationArrows = pageable.totalPages > 10;

  useEffect(() => {
    if (shouldFetch.current) {
      shouldFetch.current = false;
      fetchData();
    }

    return () => {
      dispatch(resetOntology(['objects', 'listLoading']));
    };
  }, [filters]);

  const createColumnValue = (label: string, item: any, primary = false) =>
    primary ? (
      <span
        className="primary"
        title={label}
        onClick={() => {
          dispatch(setActiveObject(item));
          navigate(`${location.pathname}/objects/${item.id}`);
        }}
      >
        {label}
      </span>
    ) : (
      label
    );

  const createPropertyColumn = (property: ObjectTypeProperty) => {
    const isPrimary = property.externalId === 'displayName';
    return {
      id: property.externalId,
      label: property.displayName,
      minWidth: 100,
      format: (item: Record<string, string | Choice[] | undefined>) => {
        let propertyValue = item?.[property.externalId];
        if (propertyValue) {
          if (Array.isArray(propertyValue)) {
            propertyValue = propertyValue.map((option) => option.displayName).join(', ');
          } else {
            if (
              [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(property.inputType)
            ) {
              propertyValue = formatDateByInputType(property.inputType, propertyValue);
            }
          }
        } else {
          propertyValue = '-';
        }
        return createColumnValue(propertyValue, item, isPrimary);
      },
    };
  };

  const columns = [
    ...properties.reduce<DataTableColumn[]>((acc, property) => {
      const propertyColumn = createPropertyColumn(property);
      if (property.externalId === 'displayName') {
        acc.splice(0, 0, propertyColumn);
      } else if (property.externalId === 'externalId') {
        acc.splice(1, 0, propertyColumn);
      } else {
        acc.push(propertyColumn);
      }
      return acc;
    }, []),
    ...relations.map((relation) => ({
      id: relation.id,
      label: relation.displayName,
      minWidth: 100,
    })),
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      format: function renderComp(item: Object) {
        return (
          <>
            <div
              id="more-actions"
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                setAnchorEl(event.currentTarget);
                setSelectedObject(item);
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
            >
              {checkPermission(['ontology', 'archive']) && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    if (selectedObject?.id)
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.REASON_MODAL,
                          props: {
                            modalTitle:
                              selectedObject?.usageStatus === 7
                                ? 'Unarchive Object'
                                : 'Archive Object',
                            modalDesc: `Provide details for ${
                              selectedObject?.usageStatus === 7 ? 'unarchiving' : 'archiving'
                            } the Object`,
                            onSumbitHandler: (
                              reason: string,
                              setFormErrors: (errors?: Error[]) => void,
                            ) => {
                              selectedObject?.usageStatus === 7
                                ? dispatch(
                                    unarchiveObject(
                                      selectedObject?.id,
                                      reason,
                                      setFormErrors,
                                      active?.externalId!,
                                    ),
                                  )
                                : dispatch(
                                    archiveObject(
                                      selectedObject.id,
                                      reason,
                                      setFormErrors,
                                      active?.externalId!,
                                    ),
                                  );
                            },
                            onSubmitModalText:
                              selectedObject?.usageStatus === 7 ? 'Unarchive' : 'Archive',
                          },
                        }),
                      );
                  }}
                >
                  <div className="list-item">
                    <MemoArchive />
                    <span>
                      {selectedObject?.usageStatus === 7 ? 'Unarchive Object' : 'Archive Object'}
                    </span>
                  </div>
                </MenuItem>
              )}
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <LoadingContainer
      loading={listLoading}
      component={
        <TabContentWrapper>
          <div className="filters">
            <ToggleSwitch
              checkedIcon={false}
              uncheckedIcon={false}
              offLabel="Show Archived"
              onLabel="Showing Archived"
              value={filters.usageStatus === 7}
              onChange={(isChecked) => {
                shouldFetch.current = true;
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  usageStatus: isChecked ? 7 : 1,
                }));
              }}
            />
            {checkPermission(['ontology', 'create']) && (
              <Button1
                id="create"
                onClick={() => {
                  dispatch(setActiveObject());
                  navigate(`${location.pathname}/objects/new`);
                }}
              >
                Create New
              </Button1>
            )}
          </div>
          <DataTable
            columns={columns}
            rows={list.map((object) => ({
              ...object,
              ...object?.properties?.reduce<Record<string, string | Choice[] | undefined>>(
                (acc, property) => {
                  acc[property.externalId] = property.choices?.length
                    ? property.choices
                    : property.value;
                  return acc;
                },
                {},
              ),
              ...object?.relations?.reduce<Record<string, string>>((acc, relation) => {
                acc[relation.id] = relation.targets.map((target) => target.displayName).join(', ');
                return acc;
              }, {}),
            }))}
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
              .slice(Math.floor(pageable.page / 10) * 10, Math.floor(pageable.page / 10) * 10 + 10)
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
      }
    />
  );
};

export default ObjectList;
