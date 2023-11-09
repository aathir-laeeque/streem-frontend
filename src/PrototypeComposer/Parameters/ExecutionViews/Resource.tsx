import QRIcon from '#assets/svg/QR';
import { FormGroup } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, ParameterType } from '#PrototypeComposer/checklist.types';
import { apiGetObjects, baseUrl } from '#utils/apiUrls';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { ObjectIdsDataFromChoices } from '#utils/parameterUtils';
import { request } from '#utils/request';
import { Object } from '#views/Ontology/types';
import { getQrCodeData, qrCodeValidator } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ParameterMode } from '#types';

const ResourceParameterWrapper = styled.div`
  display: flex;
  gap: 12px;
  .form-group,
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

const ResourceTaskView: FC<
  Omit<ParameterProps, 'taskId'> & { selectedObject?: any; onChangeHandler?: any }
> = ({ parameter, form, selectedObject, onChangeHandler }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<{
    isLoading: Boolean;
    options: any[];
  }>({
    isLoading: false,
    options: [],
  });
  const { options, isLoading } = state;
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  const referencedParameterIds = useRef(
    parameter?.data?.propertyFilters?.fields?.reduce((acc, currField) => {
      if (currField?.referencedParameterId) {
        acc.push(currField.referencedParameterId);
      }
      return acc;
    }, []) || [],
  );

  const { setValue, watch } = form;
  const parameterInForm = watch(parameter.id, {});
  const linkedParameter = parameter?.autoInitialize?.parameterId
    ? watch(parameter?.autoInitialize?.parameterId)
    : undefined;
  const linkedParameterObjectId = useRef(linkedParameter?.data?.choices?.[0]?.objectId);
  const parameterForFilters = watch(referencedParameterIds.current, {});
  let interval: number | undefined = undefined;

  const parameterForFiltersValueChange = referencedParameterIds.current?.map(
    (curr) =>
      parameterForFilters?.[curr]?.data?.input ?? parameterForFilters?.[curr]?.data?.choices,
  );

  useEffect(() => {
    if (parameter.mode !== ParameterMode.READ_ONLY) getOptions(getUrl(0));
  }, parameterForFiltersValueChange);

  useEffect(() => {
    interval = window.setInterval(() => {
      if (linkedParameter?.data?.choices?.length) {
        handleAutoInitialize();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [linkedParameter]);

  useEffect(() => {
    if (selectedObject?.objectType?.id === parameter?.data?.objectTypeId) {
      setTimeout(() => {
        const parameterData = {
          ...parameter,
          data: {
            ...parameter.data,
            choices: [
              {
                objectId: selectedObject.id,
                objectDisplayName: selectedObject.displayName,
                objectExternalId: selectedObject.externalId,
                collection: selectedObject.collection,
              },
            ],
          },
          response: {
            value: null,
            reason: '',
            state: 'EXECUTED',
            choices: {},
            medias: [],
            parameterValueApprovalDto: null,
          },
        };
        setValue(parameter.id, parameterData, {
          shouldDirty: true,
          shouldValidate: true,
        });
        onChangeHandler(parameterData);
      }, 100);
    }
  }, []);

  const getOptions = async (url?: string) => {
    if (url) {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response: ResponseObj<any> = await request('GET', url);
        if (response.pageable) {
          pagination.current = {
            current: response.pageable?.page,
            isLast: response.pageable?.last,
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

  const getUrl = (page: number) => {
    if (parameter?.data?.propertyFilters) {
      return `${baseUrl}${parameter.data.urlPath}&page=${page}&filters=${encodeURIComponent(
        JSON.stringify(getFields(parameter.data.propertyFilters)),
      )}`;
    } else {
      return `${baseUrl}${parameter.data.urlPath}&page=${page}`;
    }
  };

  const getFields = (filters: { op: string; fields: any[] }) => {
    const { fields, op } = filters;
    const _fields = fields?.map((currField) => {
      if (currField?.referencedParameterId) {
        const referencedParameterData =
          parameterForFilters?.[currField?.referencedParameterId]?.data?.input ??
          ObjectIdsDataFromChoices(
            parameterForFilters?.[currField?.referencedParameterId]?.data?.choices,
          );

        let value;

        if (referencedParameterData) {
          if (
            parameterForFilters?.[currField?.referencedParameterId]?.type ===
              MandatoryParameter.CALCULATION ||
            parameterForFilters?.[currField?.referencedParameterId]?.type ===
              MandatoryParameter.NUMBER
          ) {
            value = Number(referencedParameterData);
          } else {
            value = referencedParameterData;
          }
        }
        return {
          field: currField.field,
          op: currField.op,
          values:
            isArray(referencedParameterData) && referencedParameterData.length > 0
              ? referencedParameterData
              : [value],
        };
      } else {
        return { field: currField?.field, op: currField?.op, values: currField?.values };
      }
    });
    return { op, fields: _fields };
  };

  const handleAutoInitialize = async () => {
    const objectId = linkedParameter?.data?.choices[0]?.objectId;
    const collection = linkedParameter?.data?.choices[0]?.collection;
    if (linkedParameterObjectId.current !== objectId || !parameterInForm?.data?.choices) {
      try {
        if (linkedParameter && objectId && collection) {
          const res: ResponseObj<Object> = await request('GET', apiGetObjects(objectId), {
            params: {
              collection,
            },
          });
          if (res.data) {
            const relation = res.data.relations.find(
              (r) => r.id === parameter.autoInitialize?.relation.id,
            );
            if (relation) {
              const target = relation.targets[0];
              const parameterData = {
                ...parameter,
                data: {
                  ...parameter.data,
                  choices: [
                    {
                      objectId: target.id,
                      objectDisplayName: target.displayName,
                      objectExternalId: target.externalId,
                      collection: target.collection,
                    },
                  ],
                },
                response: {
                  value: null,
                  reason: '',
                  state: 'EXECUTED',
                  choices: {},
                  medias: [],
                  parameterValueApprovalDto: null,
                },
              };
              setValue(parameter.id, parameterData, {
                shouldDirty: true,
                shouldValidate: true,
              });
              linkedParameterObjectId.current = objectId;
              onChangeHandler(parameterData);
            }
          }
        } else {
          throw `${linkedParameter?.label} must be selected before selecting ${parameter.label} parameter`;
        }
      } catch (error) {
        dispatch(
          showNotification({
            type: NotificationType.ERROR,
            msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
          }),
        );
        clearInterval(interval);
        const parameterData = {
          ...parameter,
          data: {
            ...parameter.data,
            choices: undefined,
          },
        };
        setValue(parameter.id, parameterData, {
          shouldDirty: true,
          shouldValidate: true,
        });
        onChangeHandler(parameterData);
      }
    }
  };

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = await getQrCodeData({
        shortCode: data,
        objectTypeId: parameter?.data?.objectTypeId,
      });
      const isObjectIdPresent = (choices, objectId) =>
        choices.some((choice) => choice.objectId === objectId);

      const isObjectIdInChoices = isObjectIdPresent(
        parameterInForm?.data?.choices || [],
        qrData.objectId,
      );
      if (qrData?.objectId) {
        const parameterData = {
          ...parameter,
          data: {
            ...parameter.data,
            choices: isObjectIdInChoices
              ? parameterInForm?.data?.choices || []
              : [
                  ...[qrData].map((currOption) => ({
                    objectId: currOption.objectId,
                    objectDisplayName: currOption.displayName,
                    objectExternalId: currOption.externalId,
                    collection: currOption.collection,
                    value: currOption.objectId,
                  })),
                  ...(parameter.type === MandatoryParameter.MULTI_RESOURCE
                    ? parameterInForm?.data?.choices || []
                    : []),
                ],
          },
          response: {
            value: null,
            reason: '',
            state: 'EXECUTED',
            choices: {},
            medias: [],
            parameterValueApprovalDto: null,
          },
        };
        await qrCodeValidator({
          data: qrData,
          callBack: () => {
            setValue(parameter.id, parameterData, {
              shouldDirty: true,
              shouldValidate: true,
            });
            onChangeHandler(parameterData);
          },
          objectTypeValidation: qrData?.objectTypeId === parameter?.data?.objectTypeId,
          filters: parameter?.data?.propertyFilters
            ? {
                op: getFields(parameter.data.propertyFilters).op,
                fields: [
                  ...(getFields(parameter.data.propertyFilters)?.fields || []),
                  { field: 'id', op: FilterOperators.EQ, values: [qrData?.objectId] },
                ],
              }
            : {},
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

  const inputByViewType = (type: ParameterType) => {
    switch (type) {
      case MandatoryParameter.RESOURCE:
        return InputTypes.SINGLE_SELECT;
      case MandatoryParameter.MULTI_RESOURCE:
        return InputTypes.MULTI_SELECT;
      default:
        return InputTypes.SINGLE_SELECT;
    }
  };

  return (
    <>
      <ResourceParameterWrapper>
        <FormGroup
          inputs={[
            {
              type: inputByViewType(parameter.type),
              props: {
                id: parameter.id,
                options: options?.map((option) => ({
                  value: option.id,
                  label: option.displayName,
                  externalId: option.externalId,
                  option,
                })),
                menuPortalTarget: document.body,
                menuPosition: 'fixed',
                menuShouldBlockScroll: true,
                ['data-id']: parameter.id,
                ['data-type']: parameter.type,
                onMenuScrollToBottom: () => {
                  if (!isLoading && !pagination.current.isLast) {
                    getOptions(getUrl(pagination.current.current + 1));
                  }
                },
                onChange: (_value: any) => {
                  const selectedOption = isArray(_value) ? _value : [_value];
                  const parameterData = {
                    ...parameter,
                    data: {
                      ...parameter.data,
                      choices: selectedOption.map((currOption: any) => ({
                        objectId: currOption.value,
                        objectDisplayName: currOption.option.displayName,
                        objectExternalId: currOption.option.externalId,
                        collection: currOption.option.collection,
                      })),
                    },
                  };
                  setValue(parameter.id, selectedOption?.length ? parameterData : null, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  onChangeHandler(parameterData);
                },
                value: parameterInForm?.data?.choices?.length
                  ? parameterInForm?.data?.choices.map((c: any) => ({
                      value: c.objectId,
                      label: c.objectDisplayName,
                      externalId: <div>&nbsp;(ID: {c.objectExternalId})</div>,
                      option: {
                        displayName: c.objectDisplayName,
                        externalId: c.objectExternalId,
                        collection: c.collection,
                      },
                    }))
                  : null,
                isSearchable: true,
                isDisabled: parameter?.autoInitialized,
              },
            },
          ]}
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
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkedParameter?.label}’
        </div>
      )}
    </>
  );
};

export default ResourceTaskView;
