import MemoArchive from '#assets/svg/Archive';
import {
  Button,
  DataTable,
  ListActionMenu,
  LoadingContainer,
  Pagination,
  TabContentProps,
  ToggleSwitch,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { InputTypes, fetchDataParams } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { MenuItem } from '@material-ui/core';
import { ArrowDropDown, CropFree } from '@material-ui/icons';
import { navigate, useLocation } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  archiveObject,
  fetchObjects,
  fetchQrShortCodeData,
  setActiveObject,
  unarchiveObject,
} from '../actions';
import { Choice, Object, ObjectTypeProperty } from '../types';
import AddEditObjectDrawer from './components/AddEditObjectDrawer';
import filterIcon from '#assets/svg/FilterIcon.svg';
import ObjectFiltersDrawer from './Overlays/ObjectFiltersDrawer';

const ObjectList: FC<TabContentProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  const objectFilters = searchParams.get('filters');
  const {
    objectTypes: { active },
    objects: { list, listLoading, pageable },
  } = useTypedSelector((state) => state.ontology);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedObject, setSelectedObject] = useState<Object | null>(null);
  const [filters, setFilters] = useState<Record<string, string | number>>({
    usageStatus: 1,
  });
  const [showAddEditObjectDrawer, setShowAddEditObjectDrawer] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const properties = active?.properties || [];
  const relations = active?.relations || [];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchObjects({
        page,
        size,
        collection: active?.externalId,
        ...filters,
      }),
    );
  };

  useEffect(() => {
    fetchData({ page });
  }, [filters, page]);

  useEffect(() => {
    if (objectFilters) {
      const filters = JSON.parse(objectFilters);
      setFilters(filters);
    }
  }, []);

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
      id: property.id,
      label: property.displayName,
      minWidth: 100,
      format: (item: Record<string, string | Choice[] | undefined>) => {
        let propertyValue = item?.[property.id];
        if (propertyValue) {
          if (Array.isArray(propertyValue)) {
            propertyValue = propertyValue.map((option) => option.displayName).join(', ');
          } else {
            if (
              [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(property.inputType)
            ) {
              propertyValue = formatDateTime({ value: propertyValue, type: property.inputType });
            }
          }
        } else {
          propertyValue = '-';
        }
        return createColumnValue(propertyValue, item, isPrimary);
      },
    };
  };

  const handlePrintQRCode = () => {
    const iFrame = document.createElement('iframe');
    iFrame.setAttribute('style', 'height: 0px; width: 0px; position: absolute');
    document.body.appendChild(iFrame);
    const qrCode = document.getElementById('QRCode');
    const contentWindow = iFrame.contentWindow;
    if (qrCode && contentWindow) {
      const container = contentWindow.document.createElement('div');
      container.setAttribute(
        'style',
        'height: 100%; width: 100%; gap: 16px; display: flex; align-items: center; flex-direction: column; justify-content: center; flex: 1;',
      );
      container.innerHTML = `<span>Object Name : ${selectedObject?.displayName}</span>`;
      container.appendChild(qrCode);
      contentWindow.document.open();
      contentWindow.document.appendChild(container);
      contentWindow.document.close();
      contentWindow.focus();
      contentWindow.print();
      document.body.removeChild(iFrame);
    }
  };

  const columns = [
    ...properties
      .filter((property) => property.flags !== 1)
      .reduce<DataTableColumn[]>((acc, property) => {
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
      format: function renderComp(item) {
        return (
          <>
            {(item[relation.id] || []).map((value, index) => (
              <div>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/ontology/object-types/${relation.objectTypeId}/objects/${value?.id}`)
                  }
                >
                  {value?.displayName}
                  {index === item[relation.id].length - 1 ? '' : ', '}
                </div>
              </div>
            ))}
          </>
        );
      },
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

            <ListActionMenu
              id="row-more-actions"
              anchorEl={anchorEl}
              keepMounted
              disableEnforceFocus
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {checkPermission(['ontology', 'archiveObject']) && (
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
                            onSubmitHandler: (
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
              <MenuItem
                onClick={() => {
                  handleClose();

                  if (selectedObject?.id && selectedObject?.shortCode) {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.QR_GENERATOR,
                        props: {
                          data: selectedObject?.shortCode,
                          selectedObject: selectedObject,
                          id: 'QRCode',
                          onPrimary: handlePrintQRCode,
                          primaryText: 'Print',
                          title: `QR Code for ${selectedObject?.displayName}`,
                        },
                      }),
                    );
                  } else if (!selectedObject?.shortCode) {
                    dispatch(
                      fetchQrShortCodeData({
                        object: selectedObject,
                        handlePrintQRCode,
                      }),
                    );
                  }
                }}
              >
                <div className="list-item">
                  <CropFree />
                  <span>View QR Code</span>
                </div>
              </MenuItem>
            </ListActionMenu>
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
              checked={filters.usageStatus === 7}
              onChange={(isChecked) => {
                navigate(`?page=${DEFAULT_PAGE_NUMBER}`, { replace: true });
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  usageStatus: isChecked ? 7 : 1,
                }));
              }}
            />
            <div className="filter-buttons-wrapper" onClick={() => setShowFiltersDrawer(true)}>
              <img className="icon" src={filterIcon} />
              {filters?.filters?.fields?.length > 0 && (
                <span>{`(${filters?.filters?.fields?.length})`}</span>
              )}
            </div>
            {checkPermission(['ontology', 'createObject']) && (
              <Button
                id="create"
                onClick={() => {
                  dispatch(setActiveObject());
                  setShowAddEditObjectDrawer(true);
                }}
              >
                Create New
              </Button>
            )}
          </div>
          <DataTable
            columns={columns}
            rows={list.map((object) => ({
              ...object,
              ...object?.properties?.reduce<Record<string, string | Choice[] | undefined>>(
                (acc, property) => {
                  acc[property.id] = property.choices?.length ? property.choices : property.value;
                  return acc;
                },
                {},
              ),
              ...object?.relations?.reduce<Record<string, string>>((acc, relation) => {
                acc[relation.id] = relation.targets.map((target) => ({
                  id: target.id,
                  displayName: target.displayName,
                }));
                return acc;
              }, {}),
            }))}
            emptyTitle="No Objects Found"
          />
          <Pagination pageable={pageable} fetchData={true} />
          {active && showAddEditObjectDrawer && (
            <AddEditObjectDrawer
              onCloseDrawer={setShowAddEditObjectDrawer}
              values={{
                objectTypeId: active.id,
                id: 'new',
              }}
              onCreate={() => fetchData({ page: pageable.page })}
            />
          )}
          {active && showFiltersDrawer && (
            <ObjectFiltersDrawer
              setShowFiltersDrawer={setShowFiltersDrawer}
              activeObjectType={active}
              onApplyFilters={setFilters}
              existingFilters={filters}
            />
          )}
        </TabContentWrapper>
      }
    />
  );
};

export default ObjectList;
