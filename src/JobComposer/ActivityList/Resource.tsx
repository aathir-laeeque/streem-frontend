import { formatOptionLabel } from '#components';
import { baseUrl } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { executeActivityLeading, fixActivityLeading } from './actions';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { ActivityProps } from './types';

const ResourceActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    setIsLoading(true);
    const response: ResponseObj<any> = await request(
      'GET',
      `${baseUrl}${activity.data.urlPath}&page=${pagination.current.current + 1}`,
    );
    if (response.data) {
      setOptions([...options, ...response.data]);
      if (response.pageable) {
        pagination.current = {
          current: response.pageable?.page,
          isLast: response.pageable?.last,
        };
      }
    }
    setIsLoading(false);
  };

  return (
    <Wrapper>
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
        value={(activity.response?.choices || []).map(
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
          const newData = {
            ...activity,
            data: {
              ...activity.data,
              choices: castedOptions.map((o) => ({
                objectId: o.value.id,
                objectDisplayName: o.value.displayName,
                objectExternalId: o.value.externalId,
                collection: o.value.collection,
              })),
            },
          };

          if (isCorrectingError) {
            dispatch(fixActivityLeading(newData));
          } else {
            dispatch(executeActivityLeading(newData));
          }
        }}
      />
    </Wrapper>
  );
};

export default ResourceActivity;
