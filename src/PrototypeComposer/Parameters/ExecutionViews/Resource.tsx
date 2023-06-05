import QRIcon from '#assets/svg/QR';
import { FormGroup } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterMode } from '#JobComposer/checklist.types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { MandatoryParameter, ParameterType } from '#PrototypeComposer/checklist.types';
import { apiGetObjects, baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Object } from '#views/Ontology/types';
import { qrCodeValidator } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

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

  const referencedParameterId = parameter?.data?.propertyFilters?.fields?.reduce(
    (acc, currField) => {
      if (currField.hasOwnProperty('referencedParameterId')) {
        acc = currField.referencedParameterId;
        return acc;
      } else {
        return null;
      }
    },
    '',
  );

  const { setValue, watch } = form;
  const parameterInForm = watch(parameter.id, {});
  const linkedParameter = watch(parameter?.autoInitialize?.parameterId);
  const parameterForFilters = watch(referencedParameterId);
  let interval: number | undefined = undefined;

  useEffect(() => {
    if (parameter?.mode && parameter.mode !== ParameterMode.READ_ONLY) getOptions(getUrl(0));
  }, [parameterForFilters?.data?.choices, parameter?.mode]);

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
          options: [...prev.options, ...response.data],
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
    const _fields = fields.map((currField) => {
      if (currField.hasOwnProperty('referencedParameterId')) {
        const referencedParameterData = parameterForFilters?.data?.choices?.[0];
        return {
          field: currField.field,
          op: currField.op,
          values: [referencedParameterData?.objectId],
        };
      } else {
        _fields.push(currField);
        return true;
      }
    });
    return { op, fields: _fields };
  };

  const handleAutoInitialize = async () => {
    const objectId = linkedParameter?.data?.choices[0]?.objectId;
    const collection = linkedParameter?.data?.choices[0]?.collection;
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
  };

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = JSON.parse(data);

      if (qrData) {
        const parameterData = {
          ...parameter,
          data: {
            ...parameter.data,
            choices: [qrData].map((currOption: any) => ({
              objectId: currOption.id,
              objectDisplayName: currOption.displayName,
              objectExternalId: currOption.externalId,
              collection: currOption.collection,
            })),
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
          validateObjectType: qrData?.objectTypeId === parameter?.data?.objectTypeId,
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
                  setValue(parameter.id, parameterData, {
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
                isSearchable: false,
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
