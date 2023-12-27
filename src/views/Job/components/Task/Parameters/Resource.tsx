import QRIcon from '#assets/svg/QR';
import { Select } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { MandatoryParameter, StoreParameter, TaskExecutionType } from '#types';
import { baseUrl } from '#utils/apiUrls';
import { FilterField, FilterOperators, ResponseObj } from '#utils/globalTypes';
import { ObjectIdsDataFromChoices } from '#utils/parameterUtils';
import { request } from '#utils/request';
import { jobActions } from '#views/Job/jobStore';
import { getQrCodeData, qrCodeValidator } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { ParameterProps } from './Parameter';

const ResourceParameterWrapper = styled.div`
  display: flex;
  gap: 12px;
  .react-custom-select {
    flex: 1;
  }
  .qr-selector {
    cursor: pointer;
    border: 1px solid #1d84ff;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }
`;

const ResourceParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const { parameters, taskExecutions } = useTypedSelector((state) => state.job);
  const [linkedResourceParameter, setLinkedResourceParameter] = useState<
    StoreParameter | undefined
  >();

  const [state, setState] = useState<{
    isLoading: Boolean;
    options: any[];
    value: any;
    isOpen: boolean;
  }>({
    isLoading: false,
    options: [],
    value: null,
    isOpen: false,
  });
  const { options, isLoading, value, isOpen } = state;
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  const propertyFilters = useRef(null);

  // Allow user to select the resource only from the list of resources selected in the MASTER task
  const taskExecution = taskExecutions.get(parameter.response.taskExecutionId);
  const isTaskRepeatOrRecurring =
    taskExecution?.type === TaskExecutionType.REPEAT ||
    taskExecution?.type === TaskExecutionType.RECURRING;

  useEffect(() => {
    if (parameter.autoInitialized) {
      const linkedResourceParameter = parameters.get(parameter!.autoInitialize!.parameterId);
      setLinkedResourceParameter(linkedResourceParameter);
    }
  }, []);

  useEffect(() => {
    if (isTaskRepeatOrRecurring) {
      const parameterResponses = parameters.get(parameter.id)?.response;

      const sortedResponses = [...parameterResponses].sort((a, b) => {
        return a.taskExecutionOrderTree - b.taskExecutionOrderTree;
      });

      setState((prev) => ({
        ...prev,
        options: sortedResponses[0]?.choices,
      }));
    } else {
      if (propertyFilters.current && isOpen) {
        getOptions(getUrl(0));
      }
    }
  }, [propertyFilters.current, isOpen]);

  useEffect(() => {
    propertyFilters.current = getPropertyFilters();
    setState((prev) => ({
      ...prev,
      value: parameter.response.choices?.length
        ? parameter.response.choices.map((choice: any) => ({
            value: choice.objectId,
            label: choice?.objectDisplayName,
            externalId: <div>&nbsp;(ID: {choice?.objectExternalId})</div>,
            option: {
              id: choice.objectId,
              displayName: choice?.objectDisplayName,
              externalId: choice?.objectExternalId,
              collection: choice?.collection,
            },
          }))
        : null,
    }));
  }, [parameter?.response?.audit?.modifiedAt]);

  //  A flag to check if the parameter has variation  from backend

  const getPropertyFilters = () => {
    const filterFieldsFromVariation =
      parameter.response?.variations?.find((variation) => variation.type === 'FILTER')
        ?.newVariation || [];
    const filters = {
      ...parameter.data?.propertyFilters,
      fields: (parameter.data?.propertyFilters?.fields || []).map((currField: FilterField) => {
        if (
          filterFieldsFromVariation?.some(
            (currVariationField: FilterField) => currVariationField.id === currField.id,
          )
        ) {
          return filterFieldsFromVariation.find(
            (currVariationField: FilterField) => currVariationField.id === currField.id,
          );
        } else {
          return currField;
        }
      }),
    };
    return filters;
  };

  const getUrl = (page: number) => {
    if (propertyFilters.current?.op) {
      return `${baseUrl}${parameter.data.urlPath}&page=${page}&filters=${encodeURIComponent(
        JSON.stringify(getFields(propertyFilters.current)),
      )}`;
    } else {
      return `${baseUrl}${parameter.data.urlPath}&page=${page}`;
    }
  };

  const getLatestValue = (responseArray: any[]) => {
    if (!responseArray || responseArray.length === 0) {
      return null;
    }
    return responseArray[responseArray.length - 1];
  };

  const getFields = (filters: { op: string; fields: any[] }) => {
    const { fields, op } = filters;
    const _fields: {
      field: any;
      op: any;
      values: any;
    }[] = [];
    fields?.forEach((currField) => {
      if (currField?.referencedParameterId) {
        const referencedParameter = parameters.get(currField.referencedParameterId);

        if (referencedParameter) {
          const latestResponse = getLatestValue(referencedParameter?.response);
          let value = latestResponse?.value ?? ObjectIdsDataFromChoices(latestResponse?.choices);

          if (value) {
            if (
              [MandatoryParameter.CALCULATION, MandatoryParameter.NUMBER].includes(
                referencedParameter.type,
              )
            ) {
              value = Number(value);
            }

            _fields.push({
              field: currField?.field,
              op: currField?.op,
              values: isArray(value) && value.length > 0 ? value : [value],
            });
          }
        }
      } else {
        _fields.push({ field: currField?.field, op: currField?.op, values: currField?.values });
      }
    });
    return { op, fields: _fields };
  };

  const getOptions = async (url?: string) => {
    if (url) {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response: ResponseObj<any> = await request('GET', url);
        if (response.pageable) {
          pagination.current = {
            current: response.pageable.page,
            isLast: response.pageable.last,
          };
        }
        setState((prev) => ({
          ...prev,
          options:
            pagination.current.current === 0 ? response.data : [...prev.options, ...response.data],
          isLoading: false,
        }));
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = await getQrCodeData({
        shortCode: data,
      });
      const isMultiResource = parameter?.type === MandatoryParameter.MULTI_RESOURCE;
      const existingChoice = parameter?.response?.choices?.find(
        (currChoice) => currChoice.objectId === qrData.objectId,
      );

      const newChoice = isMultiResource
        ? !existingChoice
          ? {
              option: { ...qrData, id: qrData?.objectId },
            }
          : null
        : {
            option: { ...qrData, id: qrData?.objectId },
          };

      const choicesArray = isMultiResource
        ? parameter?.response?.choices?.map((currParam) => ({
            option: {
              id: currParam.objectId,
              displayName: currParam?.objectDisplayName,
              externalId: currParam?.objectExternalId,
              collection: currParam?.collection,
            },
            value: currParam.objectId,
            label: currParam?.objectDisplayName,
            externalId: currParam?.objectExternalId,
          }))
        : [];

      const result = isMultiResource
        ? newChoice
          ? [newChoice, ...choicesArray]
          : choicesArray
        : newChoice
        ? [newChoice]
        : [];

      if (qrData?.objectId) {
        await qrCodeValidator({
          data: qrData,
          callBack: () => onSelectOption(result),
          objectTypeValidation: qrData?.objectTypeId === parameter?.data?.objectTypeId,
          filters: propertyFilters.current?.op
            ? {
                op: getFields(propertyFilters.current).op,
                fields: [
                  ...(getFields(propertyFilters.current)?.fields || []),
                  { field: 'id', op: FilterOperators.EQ, values: [qrData?.objectId] },
                ],
              }
            : undefined,
        });
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

  const onSelectOption = (options: any) => {
    const newData = {
      ...parameter,
      data: {
        ...parameter?.data,
        choices: options?.map((o: any) => ({
          objectId: o.option?.id || o.option?.objectId,
          objectDisplayName: o.option?.displayName || o.option?.objectDisplayName,
          objectExternalId: o.option?.externalId || o.option?.objectExternalId,
          collection: o.option?.collection,
        })),
      },
    };

    setState((prev) => ({
      ...prev,
      value: options?.length ? options : null,
    }));

    if (isCorrectingError) {
      dispatch(
        jobActions.fixParameter({
          parameter: newData,
        }),
      );
    } else {
      dispatch(
        jobActions.executeParameter({
          parameter: newData,
        }),
      );
    }
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter?.type}>
      <ResourceParameterWrapper>
        <Select
          isDisabled={parameter?.autoInitialized}
          options={options?.map((option) => ({
            value: option.id || option.objectId,
            label: option?.displayName || option?.objectDisplayName,
            externalId: option?.externalId || option?.objectExternalId,
            option,
          }))}
          onMenuOpen={() => setState((prev) => ({ ...prev, isOpen: true }))}
          onMenuClose={() => setState((prev) => ({ ...prev, isOpen: false }))}
          isMulti={parameter.type === MandatoryParameter.MULTI_RESOURCE}
          value={value}
          placeholder="You can select one option here"
          onMenuScrollToBottom={() => {
            if (!isLoading && !pagination?.current?.isLast && !isTaskRepeatOrRecurring) {
              getOptions(getUrl(pagination?.current?.current + 1));
            }
          }}
          styles={customSelectStyles}
          onChange={(options) => {
            const castedOptions = isArray(options) ? options : [options];
            onSelectOption(castedOptions);
          }}
        />
        {!parameter?.autoInitialized && (
          <div
            className="qr-selector"
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.QR_SCANNER,
                  props: { onSuccess: onSelectWithQR },
                }),
              );
            }}
          >
            <QRIcon />
          </div>
        )}
      </ResourceParameterWrapper>
      {parameter?.autoInitialized && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkedResourceParameter?.label}’
        </div>
      )}
    </Wrapper>
  );
};

export default ResourceParameter;
