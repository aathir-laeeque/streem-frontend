import { formatOptionLabel } from '#components';
import { baseUrl } from '#utils/apiUrls';
import { request } from '#utils/request';
import { isArray } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { executeActivityLeading, fixActivityLeading } from './actions';
import { customSelectStyles } from './MultiSelect/commonStyles';
import { Wrapper } from './MultiSelect/styles';
import { ActivityProps } from './types';

const ResourceActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    const response: { data: any[]; errors: { message: string }[] } = await request(
      'GET',
      `${baseUrl}${activity.data.urlPath}`,
    );
    if (response.data) {
      setOptions(response.data);
    }
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
