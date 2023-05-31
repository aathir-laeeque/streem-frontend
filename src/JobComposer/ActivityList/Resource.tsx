import { MandatoryParameter } from '#JobComposer/checklist.types';
import QRIcon from '#assets/svg/QR';
import { Button, Select } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { apiAutoInitialize, baseUrl } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { qrCodeValidator } from '#views/Ontology/utils';
import { LinkOutlined } from '@material-ui/icons';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { executeParameterLeading, fixParameterLeading, updateExecutedParameter } from './actions';
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
      if (response.pageable) {
        pagination.current = {
          current: response.pageable.page,
          isLast: response.pageable.last,
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

    if (isCorrectingError) {
      dispatch(fixParameterLeading(newData));
    } else {
      dispatch(executeParameterLeading(newData));
    }
  };

  const handleAutoInitialize = async () => {
    if (data && data?.id) {
      const res = await request('PATCH', apiAutoInitialize(parameter.id), {
        data: {
          jobId: data!.id,
        },
      });
      if (res.data) {
        dispatch(updateExecutedParameter(res.data));
      }
    }
  };

  const linkedResourceParameter = parametersById?.[parameter?.autoInitialize?.parameterId];

  return (
    <Wrapper data-id={parameter.id} data-type={parameter.type}>
      <ResourceParameterWrapper>
        <Select
          className="multi-select"
          isDisabled={parameter?.autoInitialized}
          options={options?.map((option) => ({
            value: option.id,
            label: option?.displayName,
            externalId: option?.externalId,
            option,
          }))}
          isMulti={parameter.type === MandatoryParameter.MULTI_RESOURCE}
          value={
            parameter?.response?.choices?.length
              ? parameter.response.choices.map((currChoice: any) => ({
                  value: currChoice.objectId,
                  label: currChoice?.objectDisplayName,
                  externalId: <div>&nbsp;(ID: {currChoice?.objectExternalId})</div>,
                  option: {
                    id: currChoice.objectId,
                    displayName: currChoice?.objectDisplayName,
                    externalId: currChoice?.objectExternalId,
                    collection: currChoice?.collection,
                  },
                }))
              : null
          }
          placeholder="You can select one option here"
          onMenuScrollToBottom={() => {
            if (!isLoading && !pagination.current.isLast) {
              getOptions();
            }
          }}
          styles={customSelectStyles}
          onChange={(options) => {
            const castedOptions = isArray(options) ? options : [options];
            onSelectOption(castedOptions);
          }}
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
    </Wrapper>
  );
};

export default ResourceParameter;
