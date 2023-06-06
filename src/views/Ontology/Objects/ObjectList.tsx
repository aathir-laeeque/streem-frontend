import MemoArchive from '#assets/svg/Archive';
import {
  Button,
  DataTable,
  ListActionMenu,
  LoadingContainer,
  PaginatedFetchData,
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
import { InputTypes } from '#utils/globalTypes';
import { formatDateByInputType } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { MenuItem } from '@material-ui/core';
import { ArrowDropDown, CropFree } from '@material-ui/icons';
import { navigate, useLocation } from '@reach/router';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  archiveObject,
  fetchObjects,
  fetchQrShortCodeData,
  resetOntology,
  setActiveObject,
  unarchiveObject,
} from '../actions';
import { Choice, Object, ObjectTypeProperty } from '../types';
import AddEditObjectDrawer from './components/AddEditObjectDrawer';

const ObjectList: FC<TabContentProps> = () => {
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
  const [showAddEditObjectDrawer, setShowAddEditObjectDrawer] = useState(false);
  const shouldFetch = useRef(true);
  const properties = active?.properties || [];
  const relations = active?.relations || [];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = (params: PaginatedFetchData = {}) => {
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

            <ListActionMenu
              id="row-more-actions"
              anchorEl={anchorEl}
              keepMounted
              disableEnforceFocus
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
                        objectId: selectedObject?.id,
                        objectTypeId: selectedObject?.objectType?.id,
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
                shouldFetch.current = true;
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  usageStatus: isChecked ? 7 : 1,
                }));
              }}
            />
            {checkPermission(['ontology', 'create']) && (
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
          <Pagination pageable={pageable} fetchData={fetchData} />
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
        </TabContentWrapper>
      }
    />
  );
};

export default ObjectList;
