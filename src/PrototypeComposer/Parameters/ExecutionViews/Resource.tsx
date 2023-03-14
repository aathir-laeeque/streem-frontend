import QRIcon from '#assets/svg/QR';
import { Button, FormGroup } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { useTypedSelector } from '#store';
import { apiGetObjects, baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
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

const ResourceTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const dispatch = useDispatch();
  const {
    auth: { selectedFacility },
    prototypeComposer: {
      parameters: {
        parameters: { list: parametersList },
      },
    },
  } = useTypedSelector((state) => state);
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

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response: ResponseObj<any> = await request(
        'GET',
        `${baseUrl}${parameter.data.urlPath}&page=${pagination.current.current + 1}`,
      );
      if (response.data) {
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
      }
    } catch (e) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const { setValue, getValues, watch } = form;
  const parameterInForm = watch(parameter.id, {});

  const handleAutoInitialize = async () => {
    const formData = getValues();
    const dependentParameter = formData?.[parameter?.autoInitialize?.parameterId];
    const objectId = dependentParameter.data.choices[0].objectId;
    const collection = dependentParameter.data.choices[0].collection;
    const res = await request('GET', apiGetObjects(objectId), {
      params: {
        collection,
      },
    });
    if (res.data) {
      const relation = res.data.relations.find(
        (r) => r.id === parameter.autoInitialize.relation.id,
      );
      const target = relation.targets[0];
      setValue(
        parameter.id,
        {
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
        },
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  };

  const linkedResourceParameter = parametersList.find(
    (currParameter) => currParameter?.id === parameter?.autoInitialize?.parameterId,
  );

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = JSON.parse(data);

      if (qrData) {
        await qrCodeValidator({
          data: qrData,
          callBack: () =>
            setValue(
              parameter.id,
              {
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
              },
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            ),
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

  return (
    <>
      <ResourceParameterWrapper>
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: parameter.id,
                options: options?.map((option) => ({
                  value: option,
                  label: option.displayName,
                  externalId: option.externalId,
                })),
                menuPortalTarget: document.body,
                menuPosition: 'fixed',
                menuShouldBlockScroll: true,
                ['data-id']: parameter.id,
                ['data-type']: parameter.type,
                onMenuScrollToBottom: () => {
                  if (!isLoading && !pagination.current.isLast) {
                    getOptions();
                  }
                },
                onChange: (value: any) => {
                  const selectedOption = isArray(value.value) ? value.value : [value.value];
                  setValue(
                    parameter.id,
                    {
                      ...parameter,
                      data: {
                        ...parameter.data,
                        choices: selectedOption.map((currOption: any) => ({
                          objectId: currOption.id,
                          objectDisplayName: currOption.displayName,
                          objectExternalId: currOption.externalId,
                          collection: currOption.collection,
                        })),
                      },
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                },
                isSearchable: false,
                placeholder: '',
                isDisabled: parameter?.autoInitialized,
                value: [
                  {
                    label: parameterInForm?.data?.choices?.[0]?.objectDisplayName,
                    externalId: parameterInForm?.data?.choices?.[0]?.objectExternalId,
                    value: parameterInForm?.data?.choices?.[0]?.objectId,
                  },
                ],
              },
            },
          ]}
        />
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
      </ResourceParameterWrapper>
      {parameter?.autoInitialized && (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkedResourceParameter?.label}’
          </div>
          <Button variant="secondary" onClick={handleAutoInitialize} style={{ marginBlock: 8 }}>
            Get Value
          </Button>
        </>
      )}
    </>
  );
};

export default ResourceTaskView;
