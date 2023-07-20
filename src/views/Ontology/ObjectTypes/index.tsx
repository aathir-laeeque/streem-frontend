import {
  Button,
  GeneralHeader,
  DataTable,
  LoadingContainer,
  TabContentProps,
  ListActionMenu,
  TextInput,
  ToggleSwitch,
  Pagination,
} from '#components';
import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper, ViewWrapper } from '#views/Jobs/ListView/styles';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  archiveObjectTypeProperty,
  archiveObjectTypeRelation,
  fetchObjectType,
  fetchObjectTypes,
  resetOntology,
} from '../actions';
import ObjectList from '../Objects/ObjectList';
import { debounce, startCase } from 'lodash';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import AddPropertyDrawer from './Components/PropertyDrawer';
import AddRelationDrawer from './Components/RelationDrawer';
import { ArrowDropDown, Search } from '@material-ui/icons';
import { MenuItem } from '@material-ui/core';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { PropertyFlags } from '../utils';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { createFetchList } from '#hooks/useFetchData';
import { apigetObjectTypeProperties, apiGetObjectTypeRelations } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
// TODO change this enum to Object and have positions defined explicity
export enum FlagPositions {
  SYSTEM,
  PRIMARY,
  TITLE,
  SEARCHABLE,
  MANDATORY,
  AUTOGENERATE,
}
// TODO move this to utils & expose methods for each flag specifically.
export const getBooleanFromDecimal = (flag: number, pos: number) => {
  return ((flag >> pos) & 1) === 1;
};

const ReadOnlyGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  .read-only {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    :last-child {
      margin-bottom: 0px;
    }

    .content {
      font-size: 14x;
      line-height: 1.14;
      color: rgba(51, 51, 51, 1);
      min-width: 150px;
      display: flex;
      align-items: flex-start;

      :last-child {
        flex: 1;
        padding-right: 20px;

        ::before {
          content: ':';
          margin-right: 24px;
        }
      }
    }
  }
`;

export const ReadOnlyGroup = ({
  items,
  ...rest
}: { items: { label: string; value: string }[] } & React.HTMLProps<HTMLDivElement>) => {
  return (
    <ReadOnlyGroupWrapper {...rest}>
      {items.map((item, index) => (
        <div className="read-only" key={index}>
          <span className="content">{item.label}</span>
          <span className="content">{item.value}</span>
        </div>
      ))}
    </ReadOnlyGroupWrapper>
  );
};

const GeneralWrapper = styled.div`
  overflow: auto;

  h4 {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    margin: unset;
    border-bottom: solid 1px #dadada;
  }

  .view {
    background: #fff;
    margin-bottom: 24px;
  }
`;

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
  sort: 'createdAt,desc',
  isArchive: false,
};

const GeneralTabContent: FC<TabContentProps> = ({ label }) => {
  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);
  if (!active) return null;
  return (
    <GeneralWrapper>
      <div className="view">
        <h4>Basic Information</h4>
        <ReadOnlyGroup
          items={[
            {
              label: 'ID',
              value: active.externalId,
            },
            {
              label: 'Display Name',
              value: active.displayName,
            },
            {
              label: 'Plural Name',
              value: active.pluralName,
            },
            {
              label: 'Description',
              value: active.description,
            },
            {
              label: 'Added On',
              value: formatDateTime(active.createdAt, 'Do MMMM YYYY, h:mm A'),
            },
          ]}
        />
      </div>
    </GeneralWrapper>
  );
};

const PropertiesTabContent: FC<TabContentProps> = ({ values }) => {
  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);

  const objectTypeId = active?.id;
  const { list, reset, pagination } = createFetchList(
    apigetObjectTypeProperties(objectTypeId),
    urlParams,
  );

  const [createPropertyDrawer, setCreatePropertyDrawer] = useState<string | boolean>('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);
  const { shouldToggle, setShouldToggle } = values;

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => setSelectedProperty(null), 200);
  };

  useEffect(() => {
    reset({ params: { ...filters } });
  }, [filters, shouldToggle]);

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ maxWidth: '306px', width: '306px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search with Property Name`}
            onChange={debounce(
              ({ value }) => reset({ params: { ...urlParams, displayName: value } }),
              500,
            )}
          />
        </div>
        <ToggleSwitch
          checkedIcon={false}
          uncheckedIcon={false}
          offLabel="Show Archived"
          onLabel="Showing Archived"
          checked={isChecked}
          onChange={(value) => {
            setIsChecked(value);
            reset({ params: { ...urlParams, isArchive: value } });
          }}
        />
        {checkPermission(['ontology', 'createObjectType']) && (
          <Button
            id="create"
            onClick={() => {
              setCreatePropertyDrawer(true);
            }}
          >
            Create New Property
          </Button>
        )}
      </div>

      <DataTable
        columns={[
          {
            id: 'displayName',
            label: 'Property Name',
            minWidth: 100,
          },
          {
            id: 'inputType',
            label: 'Input Type',
            minWidth: 100,
            format: (item) => {
              const contentString = (inputType: string) => {
                switch (inputType) {
                  case MandatoryParameter.SINGLE_LINE:
                    return 'Single Line';
                  case MandatoryParameter.MULTI_LINE:
                    return 'Multi Line';
                  case MandatoryParameter.DATE:
                    return 'Date';
                  case MandatoryParameter.DATE_TIME:
                    return 'Date Time';
                  case MandatoryParameter.NUMBER:
                    return 'Number';
                  case MandatoryParameter.SINGLE_SELECT:
                    return 'Single Select';
                  case MandatoryParameter.MULTISELECT:
                  case 'MULTI_SELECT':
                    return 'Multi Select';
                  default:
                    return '';
                }
              };
              return contentString(item.inputType);
            },
          },
          {
            id: 'mandatory',
            label: 'Is Mandatory?',
            minWidth: 100,
            format: (item) =>
              getBooleanFromDecimal(item.flags, FlagPositions.MANDATORY) ? 'Yes' : 'No',
          },
          {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (item) => 'Active',
          },
          ...(checkPermission(['ontology', 'editObjectType'])
            ? [
                {
                  id: 'action',
                  label: 'Action',
                  minWidth: 100,
                  format: function renderComp(item) {
                    return item.usageStatus === 1 &&
                      ![PropertyFlags.EXTERNAL_ID, PropertyFlags.SYSTEM].includes(item.flags) ? (
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div
                          id="more-actions"
                          onClick={(event: any) => {
                            setAnchorEl(event.currentTarget);
                            setSelectedProperty(item);
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
                          {[PropertyFlags.MANDATORY, PropertyFlags.OPTIONAL]?.includes(
                            selectedProperty?.flags,
                          ) && (
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                dispatch(
                                  openOverlayAction({
                                    type: OverlayNames.REASON_MODAL,
                                    props: {
                                      modalTitle: 'Archive Property',
                                      modalDesc: `Are you sure you want to archive this property?`,
                                      onSubmitHandler: (
                                        reason: string,
                                        setFormErrors: (errors?: Error[]) => void,
                                      ) => {
                                        dispatch(
                                          archiveObjectTypeProperty({
                                            objectTypeId: active?.id,
                                            propertyId: selectedProperty?.id,
                                            reason,
                                            setFormErrors,
                                          }),
                                        );
                                        setTimeout(() => setShouldToggle((prev) => !prev), 300);
                                      },
                                      onSubmitModalText: 'Archive',
                                    },
                                  }),
                                );
                              }}
                            >
                              <div className="list-item">
                                <ArchiveOutlinedIcon />
                                <span>Archive</span>
                              </div>
                            </MenuItem>
                          )}
                          {[
                            PropertyFlags.MANDATORY,
                            PropertyFlags.DISPLAY_NAME,
                            PropertyFlags.OPTIONAL,
                          ]?.includes(selectedProperty?.flags) && (
                            <MenuItem
                              onClick={() => {
                                setAnchorEl(null);
                                setCreatePropertyDrawer('Edit');
                              }}
                            >
                              <div className="list-item">
                                <EditOutlinedIcon />
                                <span>Edit</span>
                              </div>
                            </MenuItem>
                          )}
                        </ListActionMenu>
                      </div>
                    ) : null;
                  },
                },
              ]
            : []),
        ]}
        emptyTitle="No Properties Found"
        rows={list}
      />
      <Pagination
        pageable={pagination}
        fetchData={(p) => reset({ params: { page: p.page, size: p.size } })}
      />
      {createPropertyDrawer && (
        <AddPropertyDrawer
          label={createPropertyDrawer}
          onCloseDrawer={setCreatePropertyDrawer}
          property={selectedProperty}
          setSelectedProperty={setSelectedProperty}
          setShouldToggle={setShouldToggle}
        />
      )}
    </TabContentWrapper>
  );
};

const RelationsTabContent: FC<TabContentProps> = ({ values }) => {
  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);

  const objectTypeId = active?.id;
  const { list, reset, pagination } = createFetchList(
    apiGetObjectTypeRelations(objectTypeId),
    urlParams,
  );

  const [createRelationDrawer, setRelationDrawer] = useState<string | boolean>('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);
  const { shouldToggle, setShouldToggle } = values;

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => setSelectedRelation(null), 200);
  };

  const fetchData = (page: number) => {
    dispatch(
      fetchObjectTypes({
        page,
        size: 256,
        usageStatus: 1,
      }),
    );
  };

  useEffect(() => {
    reset({ params: { ...filters } });
  }, [filters, shouldToggle]);

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ maxWidth: '306px', width: '306px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search with Relation Name`}
            onChange={debounce(
              ({ value }) => reset({ params: { ...urlParams, displayName: value } }),
              500,
            )}
          />
        </div>
        <ToggleSwitch
          checkedIcon={false}
          uncheckedIcon={false}
          offLabel="Show Archived"
          onLabel="Showing Archived"
          checked={isChecked}
          onChange={(value) => {
            setIsChecked(value);
            reset({ params: { ...urlParams, isArchive: value } });
          }}
        />
        {checkPermission(['ontology', 'createObjectType']) && (
          <Button
            id="create"
            onClick={() => {
              setRelationDrawer(true);
            }}
          >
            Create New Relation
          </Button>
        )}
      </div>
      <DataTable
        columns={[
          {
            id: 'relatedTo',
            label: 'Related To',
            minWidth: 100,
            format: (item) => {
              return startCase(item.externalId);
            },
          },
          {
            id: 'displayName',
            label: 'Relation Name',
            minWidth: 100,
          },
          {
            id: 'cardinality',
            label: 'Cardinality',
            minWidth: 100,
            format: (item) => {
              const contentString = (cardinality: string) => {
                switch (cardinality) {
                  case 'ONE_TO_ONE':
                    return 'One to One';
                  case 'ONE_TO_MANY':
                    return 'One to Many';
                  default:
                    return '';
                }
              };
              return contentString(item?.target?.cardinality);
            },
          },

          {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (item) => 'Active',
          },
          ...(checkPermission(['ontology', 'editObjectType'])
            ? [
                {
                  id: 'action',
                  label: 'Action',
                  minWidth: 100,
                  format: function renderComp(item) {
                    return item?.usageStatus === 1 ? (
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div
                          id="more-actions"
                          onClick={(event: any) => {
                            setAnchorEl(event.currentTarget);
                            setSelectedRelation(item);
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
                                  type: OverlayNames.REASON_MODAL,
                                  props: {
                                    modalTitle: 'Archive Relation',
                                    modalDesc: `Are you sure you want to archive this relation?`,
                                    onSubmitHandler: (
                                      reason: string,
                                      setFormErrors: (errors?: Error[]) => void,
                                    ) => {
                                      dispatch(
                                        archiveObjectTypeRelation({
                                          objectTypeId: active?.id,
                                          relationId: selectedRelation?.id,
                                          reason,
                                          setFormErrors,
                                        }),
                                      );
                                      setTimeout(() => setShouldToggle((prev) => !prev), 300);
                                    },
                                    onSubmitModalText: 'Archive',
                                  },
                                }),
                              );
                            }}
                          >
                            <div className="list-item">
                              <ArchiveOutlinedIcon />
                              <span>Archive</span>
                            </div>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setAnchorEl(null);
                              setRelationDrawer('Edit');
                            }}
                          >
                            <div className="list-item">
                              <EditOutlinedIcon />
                              <span>Edit</span>
                            </div>
                          </MenuItem>
                        </ListActionMenu>
                      </div>
                    ) : null;
                  },
                },
              ]
            : []),
        ]}
        emptyTitle="No Relations Found"
        rows={list}
      />
      <Pagination
        pageable={pagination}
        fetchData={(p) => reset({ params: { page: p.page, size: p.size } })}
      />
      {createRelationDrawer && (
        <AddRelationDrawer
          label={createRelationDrawer}
          onCloseDrawer={setRelationDrawer}
          relation={selectedRelation}
          setSelectedRelation={setSelectedRelation}
          setShouldToggle={setShouldToggle}
        />
      )}
    </TabContentWrapper>
  );
};

const ObjectTypesContent = ({ id }: RouteComponentProps<{ id: string }>) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { active, activeLoading },
  } = useTypedSelector((state) => state.ontology);
  const [shouldToggle, setShouldToggle] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchObjectType(id));
    }

    return () => {
      dispatch(resetOntology(['objectTypes', 'activeLoading']));
    };
  }, [shouldToggle]);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: 'Objects',
        tabContent: ObjectList,
      },
      { label: 'Basic Information', tabContent: GeneralTabContent },
      {
        label: 'Properties',
        tabContent: PropertiesTabContent,
        values: { shouldToggle, setShouldToggle },
      },
      {
        label: 'Relations',
        tabContent: RelationsTabContent,
        values: { shouldToggle, setShouldToggle },
      },
    ],
  });

  return (
    <ViewWrapper>
      <GeneralHeader heading={`Object Types - ${activeLoading ? '...' : active?.pluralName}`} />
      <div className="list-table">
        {renderTabHeader()}
        <LoadingContainer loading={activeLoading} component={<>{renderTabContent()}</>} />
      </div>
    </ViewWrapper>
  );
};

export default ObjectTypesContent;
