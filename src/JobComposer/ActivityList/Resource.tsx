import { MandatoryParameter, ParameterMode } from '#JobComposer/checklist.types';
import QRIcon from '#assets/svg/QR';
import { Select } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { baseUrl } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { qrCodeValidator } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import { isArray, keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { executeParameterLeading, fixParameterLeading } from './actions';
import { ParameterProps } from './types';

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
  const {
    composer: {
      data,
      parameters: { parametersById },
    },
  } = useTypedSelector((state) => state);
  const [state, setState] = useState<{
    isLoading: Boolean;
    options: any[];
    value: any;
  }>({
    isLoading: false,
    options: [],
    value: null,
  });
  const { options, isLoading, value } = state;
  const pagination = useRef({
    current: -1,
    isLast: false,
  });
  const cjfParametersById = keyBy(data?.parameterValues, 'id');
  const linkedResourceParameter = parametersById?.[parameter?.autoInitialize?.parameterId];
  const referencedParameterId = parameter?.data?.propertyFilters?.fields?.reduce(
    (acc, currField) => {
      if (currField?.hasOwnProperty('referencedParameterId')) {
        acc = currField.referencedParameterId;
        return acc;
      } else {
        return null;
      }
    },
    '',
  );

  useEffect(() => {
    if (parameter.mode !== ParameterMode.READ_ONLY) getOptions(getUrl(0));
  }, [
    parameter?.mode,
    parametersById?.[referencedParameterId]?.response?.choices,
    cjfParametersById?.[referencedParameterId]?.response?.choices,
  ]);

  useEffect(() => {
    if (parameter?.autoInitialized && parameter?.response?.choices?.length) {
      setState((prev) => ({
        ...prev,
        value: parametersById[parameter.id].response.choices.map((choice: any) => ({
          value: choice.objectId,
          label: choice?.objectDisplayName,
          externalId: <div>&nbsp;(ID: {choice?.objectExternalId})</div>,
          option: {
            id: choice.objectId,
            displayName: choice?.objectDisplayName,
            externalId: choice?.objectExternalId,
            collection: choice?.collection,
          },
        })),
      }));
    } else if (parametersById?.[parameter.id]?.data?.choices?.length) {
      setState((prev) => ({
        ...prev,
        value: null,
      }));
    }
  }, [parameter?.response?.choices, parameter?.data?.choices]);

  const getUrl = (page: number) => {
    if (parameter?.data?.propertyFilters) {
      if (referencedParameterId) {
        if (parametersById[referencedParameterId]?.response?.choices?.length > 0) {
          return `${baseUrl}${parameter.data.urlPath}&page=${page}&filters=${encodeURIComponent(
            JSON.stringify(getFields(parameter?.data?.propertyFilters)),
          )}`;
        }
      } else {
        return `${baseUrl}${parameter.data.urlPath}&page=${page}&filters=${encodeURIComponent(
          JSON.stringify(getFields(parameter?.data?.propertyFilters)),
        )}`;
      }
    } else {
      return `${baseUrl}${parameter.data.urlPath}&page=${page}`;
    }
  };

  const getFields = (filters: { op: string; fields: any[] }) => {
    const { fields, op } = filters;
    const _fields = fields?.map((currField) => {
      if (currField.hasOwnProperty('referencedParameterId')) {
        const referencedParameterData =
          parametersById[currField.referencedParameterId]?.response?.value ??
          parametersById[currField.referencedParameterId]?.response?.choices?.[0] ??
          cjfParametersById[currField.referencedParameterId]?.response?.choices?.[0];
        let value;
        if (
          parametersById[currField.referencedParameterId]?.type === 'CALCULATION' ||
          parametersById[currField.referencedParameterId]?.type === 'NUMBER'
        ) {
          value = Number(referencedParameterData);
        } else {
          value = referencedParameterData;
        }
        return {
          field: currField?.field,
          op: currField?.op,
          values: [referencedParameterData?.objectId ?? value],
        };
      } else {
        return currField;
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
      const qrData = JSON.parse(data);
      if (qrData) {
        await qrCodeValidator({
          data: qrData,
          callBack: () =>
            onSelectOption([
              {
                option: qrData,
              },
            ]),
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

  const onSelectOption = (options: any) => {
    const newData = {
      ...parameter,
      data: {
        ...parameter?.data,
        choices: options?.map((o: any) => ({
          objectId: o.option?.id,
          objectDisplayName: o.option?.displayName,
          objectExternalId: o.option?.externalId,
          collection: o.option?.collection,
        })),
      },
    };

    setState((prev) => ({
      ...prev,
      value: options,
    }));

    if (isCorrectingError) {
      dispatch(fixParameterLeading(newData));
    } else {
      dispatch(executeParameterLeading(newData));
    }
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter?.type}>
      <ResourceParameterWrapper>
        <Select
          isDisabled={parameter?.autoInitialized}
          options={options?.map((option) => ({
            value: option.id,
            label: option?.displayName,
            externalId: option?.externalId,
            option,
          }))}
          isMulti={parameter.type === MandatoryParameter.MULTI_RESOURCE}
          value={value}
          placeholder="You can select one option here"
          onMenuScrollToBottom={() => {
            if (!isLoading && !pagination?.current?.isLast) {
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
