import { formatOptionLabel, Select } from '#components';
import { baseUrl } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import QRIcon from '#assets/svg/QR';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameterLeading, fixParameterLeading } from './actions';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { ParameterProps } from './types';
import styled from 'styled-components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';

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

  const onSelectWithQR = (data: any) => {
    try {
      const qrData = JSON.parse(data);
      console.log('qrData', qrData);
      onSelectOption([
        {
          value: qrData,
        },
      ]);
      console.log('qrData', qrData);
    } catch (e) {
      console.log('error while parsing qr data', e);
    }
  };

  const onSelectOption = (options: any) => {
    const newData = {
      ...parameter,
      data: {
        ...parameter.data,
        choices: options.map((o: any) => ({
          objectId: o.value.id,
          objectDisplayName: o.value.displayName,
          objectExternalId: o.value.externalId,
          collection: o.value.collection,
        })),
      },
    };

    if (isCorrectingError) {
      dispatch(fixParameterLeading(newData));
    } else {
      dispatch(executeParameterLeading(newData));
    }
  };

  return (
    <Wrapper>
      <ResourceParameterWrapper>
        <Select
          className="multi-select"
          formatOptionLabel={formatOptionLabel}
          options={
            options?.map((option) => ({
              value: option,
              label: option.displayName,
              externalId: option.externalId,
            })) as any
          }
          value={(parameter.response?.choices || []).map(
            (c: { objectId: string; objectDisplayName: string; objectExternalId: string }) => ({
              value: c,
              label: c.objectDisplayName,
              externalId: c.objectExternalId,
            }),
          )}
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
    </Wrapper>
  );
};

export default ResourceParameter;
