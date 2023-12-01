import { labelByConstraint } from '#PrototypeComposer/Parameters/ValidationViews/Resource';
import backIcon from '#assets/svg/back-icon.svg';
import {
  BaseModal,
  Button,
  CustomTag,
  DataTable,
  LoadingContainer,
  Pagination,
  TextInput,
} from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import { createFetchList } from '#hooks/useFetchData';
import { useTypedSelector } from '#store';
import { Job, MandatoryParameter, Parameter, ParameterVariationType } from '#types';
import { openLinkInNewTab } from '#utils';
import {
  apiArchiveParameterVariation,
  apiGetObjectTypes,
  apiGetVariationsList,
  apiGetVariationsListByParameterId,
} from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators } from '#utils/globalTypes';
import { fileTypeCheck } from '#utils/parameterUtils';
import { getErrorMsg, request } from '#utils/request';
import { generateShouldBeCriteria } from '#utils/stringUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeviateParameterDrawer, {
  getLabelByVariationType,
} from '../components/DeviateParameterDrawer';
import checkPermission from '#services/uiPermissions';

const Wrapper = styled.div`
  .modal {
    min-height: 100dvh;
    min-width: 100dvw !important;
  }

  .modal-body {
    height: 100%;
  }

  .back-icon-text {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    gap: 22px;
    align-items: center;
    cursor: pointer;
  }
`;

const GoBackToTask = (onClick: any) => {
  return (
    <div onClick={onClick} className="back-icon-text">
      <img src={backIcon} alt="icon"></img>
      Parameter Variation
    </div>
  );
};

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
};

export const objectTypesUrlParams = {
  ...urlParams,
  usageStatus: 1,
  filters: {
    op: FilterOperators.AND,
    fields: [],
  },
};

const ParameterVariationContent: FC<
  CommonOverlayProps<{
    jobId?: Job['id'];
    isReadOnly?: boolean;
    parameterId?: string;
  }>
> = ({ closeAllOverlays, closeOverlay, props: { jobId, isReadOnly = false, parameterId } }) => {
  const dispatch = useDispatch();

  const { list, reset, pagination, status } = createFetchList(
    parameterId ? apiGetVariationsListByParameterId(parameterId) : apiGetVariationsList(jobId!),
    { ...urlParams, ...(parameterId && { jobId }) },
    false,
  );
  const {
    list: objectTypesList,
    reset: resetObjectTypesList,
    status: objectTypesListStatus,
  } = createFetchList(apiGetObjectTypes(), objectTypesUrlParams, false);

  const objectTypeIds = useRef<string[]>([]);
  const { parameters } = useTypedSelector((state) => state.job);
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);
  const [deviateParameterDrawer, setDeviateParameterDrawer] = useState<string | boolean>('');
  const [shouldToggle, setShouldToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isCreateEditAllowed = !checkPermission(['plannedVariation', 'create']) || isReadOnly;

  const archiveVariation = async (
    parameterId: string,
    variationId: string,
    type: string,
    reason: string,
    setFormErrors: (errors?: Error[]) => void,
  ) => {
    try {
      const { data, errors } = await request('DELETE', apiArchiveParameterVariation(), {
        data: { reason, jobId, parameterId, variationId, type },
      });
      if (data) {
        setFormErrors(errors);
        setShouldToggle((prev) => !prev);
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Variation Deleted Successfully',
          }),
        );
      } else {
        throw getErrorMsg(errors);
      }
    } catch (error) {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  const generateVariationDetailText = (details: any[], type: string, parameterId: string) => {
    const parameterData = parameters.get(parameterId);
    switch (type) {
      case ParameterVariationType.FILTER:
        return getContentString(details, parameterData);
      case ParameterVariationType.VALIDATION:
        return getContentString(details, parameterData, true);
      case ParameterVariationType.SHOULD_BE:
        const detail = Array.isArray(details) ? details[0] : details;
        const uom = detail?.uom || '';
        const value =
          detail.operator === 'BETWEEN'
            ? `${detail.lowerValue} ${uom} and ${detail.upperValue} ${uom}`
            : `${detail.value} ${uom}`;
        return `Check if entered value is ${generateShouldBeCriteria(detail)} ${value}`;
    }
  };

  const getContentString = (
    details: any[],
    parameter: Parameter,
    isValidation: boolean = false,
  ) => {
    switch (parameter.type) {
      case MandatoryParameter.NUMBER:
        return details
          ?.map((currDetail: any) => {
            const dependentParameter = parameters.get(currDetail.parameterId);
            return `Check if entered value ${
              labelByConstraint(parameter.type)[currDetail.constraint]
            } ${currDetail.propertyDisplayName} of selected ${dependentParameter?.label} value`;
          })
          .join(',');

      case MandatoryParameter.RESOURCE:
        return isValidation
          ? details
              ?.map((currDetail: any) => {
                const value = currDetail?.value
                  ? currDetail.value
                  : currDetail.options.map((currOption) => currOption.displayName).join(',');
                return `Check if ${currDetail.propertyDisplayName} of ${
                  parameter.data.objectTypeDisplayName
                } ${labelByConstraint(parameter.type)[currDetail.constraint]} ${value}`;
              })
              .join(',')
          : details
              ?.map((currDetail: any) => {
                const dependentParameter = parameters.get(currDetail.referencedParameterId);
                const parameterObjectType = objectTypesList.find(
                  (currObjectType) => currObjectType.id === parameter?.data.objectTypeId,
                );
                const parameterObjectTypeProperty = [
                  ...(parameterObjectType?.properties || []),
                  ...(parameterObjectType?.relations || []),
                ].find((currProperty) => currProperty.id === currDetail?.field?.split('.')[1]);
                const value =
                  currDetail.selector === 'PARAMETER'
                    ? `the selected ${dependentParameter.label} value`
                    : currDetail?.displayName
                    ? `${currDetail.displayName} ${
                        currDetail?.externalId ? currDetail.externalId : ''
                      }`
                    : ` ${currDetail.values[0]}`;
                return `Check if ${parameter.data.objectTypeDisplayName} where ${
                  parameterObjectTypeProperty?.displayName
                } ${labelByConstraint(parameter.type)[currDetail.op]} ${value}`;
              })
              .join(',');

      default:
        return '';
    }
  };

  const getObjectTypeIdsForResourceParameters = () => {
    list.map((item) => {
      if (item.parameterType === MandatoryParameter.RESOURCE) {
        const parameter = parameters.get(item.parameterId);
        if (parameter) {
          objectTypeIds.current.push(parameter.data.objectTypeId);
        }
      }
    });
  };

  useEffect(() => {
    reset({ params: { ...filters } });
  }, [filters, shouldToggle]);

  useEffect(() => {
    if (list.length) {
      getObjectTypeIdsForResourceParameters();
    }
  }, [list]);

  useEffect(() => {
    if (objectTypeIds.current.length) {
      resetObjectTypesList({
        params: {
          ...objectTypesUrlParams,
          size: objectTypeIds.current.length || objectTypesUrlParams.size,
          filters: {
            op: FilterOperators.AND,
            fields: [{ field: 'id', op: FilterOperators.ANY, values: objectTypeIds.current }],
          },
        },
      });
      setLoading(
        list.some((currList) => currList.parameterType === MandatoryParameter.RESOURCE)
          ? status === 'loading' && objectTypesListStatus === 'loading'
          : status === 'loading',
      );
    } else {
      setLoading(status === 'loading');
    }
  }, [objectTypeIds.current.length]);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={true}
        title={GoBackToTask(closeOverlay)}
        showFooter={false}
        showCloseIcon={true}
      >
        <TabContentWrapper>
          <div className="filters">
            <div style={{ width: '280px' }}>
              <TextInput
                afterElementWithoutError
                AfterElement={Search}
                afterElementClass=""
                placeholder={`Search by Parameter name`}
                onChange={debounce((option) => {
                  setFilters((prev) => ({
                    ...prev,
                    parameterName: option?.value,
                  }));
                }, 500)}
              />
            </div>

            <Button
              id="create"
              onClick={() => setDeviateParameterDrawer(true)}
              disabled={isCreateEditAllowed}
            >
              Add Variation
            </Button>
          </div>
          <LoadingContainer
            loading={loading}
            component={
              <>
                <DataTable
                  columns={[
                    {
                      id: 'parameterName',
                      label: 'Parameter Name',
                      minWidth: 100,
                      format: (item) => {
                        return item.parameterName;
                      },
                    },
                    {
                      id: 'variationName',
                      label: 'Variation Name',
                      minWidth: 100,
                      format: (item) => {
                        return item.name;
                      },
                    },
                    {
                      id: 'variationNumber',
                      label: 'Variation Number',
                      minWidth: 100,
                      format: (item) => {
                        const media = item?.medias?.[0] || {};
                        const mediaType = media?.type?.split('/')[1];
                        const isImage = fileTypeCheck(['png', 'jpg', 'jpeg'], mediaType);
                        const customStyle = !item.medias
                          ? {}
                          : { color: '#1d84ff', cursor: 'pointer' };
                        return (
                          <CustomTag
                            as={isImage ? 'a' : 'div'}
                            target={isImage ? '_blank' : undefined}
                            href={isImage ? media.link : undefined}
                            onClick={
                              !item.medias
                                ? undefined
                                : isImage
                                ? undefined
                                : () => {
                                    const queryString = new URLSearchParams({
                                      link: media.link,
                                    }).toString();
                                    openLinkInNewTab(
                                      `/jobs/${
                                        item.jobId as string
                                      }/fileUpload/print?${queryString}`,
                                    );
                                  }
                            }
                          >
                            <span style={customStyle}> {item.variationNumber}</span>
                          </CustomTag>
                        );
                      },
                    },
                    {
                      id: 'location',
                      label: 'Location',
                      minWidth: 100,
                      format: (item) => `Task ${item.stageOrderTree}.${item.taskOrderTree}`,
                    },
                    {
                      id: 'variationType',
                      label: 'Variation Type',
                      minWidth: 100,
                      format: (item) => {
                        return getLabelByVariationType(item.type);
                      },
                    },
                    {
                      id: 'valueBefore',
                      label: 'Value Before',
                      minWidth: 100,
                      format: (item) => {
                        return generateVariationDetailText(
                          item.oldVariation,
                          item.type,
                          item.parameterId,
                        );
                      },
                    },
                    {
                      id: 'valueAfter',
                      label: 'Value After',
                      minWidth: 100,
                      format: (item) => {
                        return generateVariationDetailText(
                          item.newVariation,
                          item.type,
                          item.parameterId,
                        );
                      },
                    },
                    {
                      id: 'action',
                      label: 'Actions',
                      minWidth: 100,
                      format: (item) => {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              gap: 20,
                              alignItems: 'flex-start',
                            }}
                          >
                            {/* <div className="primary">
                              <span>Edit</span>
                            </div> */}
                            <div
                              className="secondary"
                              onClick={() => {
                                if (!isCreateEditAllowed) {
                                  dispatch(
                                    openOverlayAction({
                                      type: OverlayNames.REASON_MODAL,
                                      props: {
                                        modalTitle: 'Delete Variation',
                                        modalDesc: `Provide reason for deleting ${item?.name}`,
                                        onSubmitHandler: (
                                          reason: string,
                                          setFormErrors: (errors?: Error[]) => void,
                                        ) => {
                                          archiveVariation(
                                            item.parameterId,
                                            item.id,
                                            item.type,
                                            reason,
                                            setFormErrors,
                                          );
                                        },
                                        onSubmitModalText: 'Confirm',
                                      },
                                    }),
                                  );
                                }
                              }}
                            >
                              <span>{isCreateEditAllowed ? '-' : 'Delete'}</span>
                            </div>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={list}
                  emptyTitle="No Variations Found"
                />
                <Pagination
                  pageable={pagination}
                  fetchData={(p) => reset({ params: { page: p.page, size: p.size } })}
                />
                {deviateParameterDrawer && (
                  <DeviateParameterDrawer
                    onCloseDrawer={setDeviateParameterDrawer}
                    label={deviateParameterDrawer}
                    setShouldToggle={setShouldToggle}
                  />
                )}
              </>
            }
          />
        </TabContentWrapper>
      </BaseModal>
    </Wrapper>
  );
};

export default ParameterVariationContent;
