import { FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FormatOptionLabelContext } from 'react-select';

const ResourceTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
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

  const { register, watch, setValue } = form;
  const data = watch('data', {});

  register('data', {
    required: true,
  });

  return (
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
            formatOptionLabel: (
              option: any,
              { context }: { context: FormatOptionLabelContext },
            ) => {
              if (context === 'menu' || context === 'value') {
                return option.label;
              }
              return <div />;
            },
            onMenuScrollToBottom: () => {
              if (!isLoading && !pagination.current.isLast) {
                getOptions();
              }
            },
            onChange: (value: any) => {
              const selectedOption = isArray(value.value) ? value.value : [value.value];
              setValue(
                'data',
                {
                  ...data,
                  [parameter.id]: {
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
                    response: {
                      value: null,
                      reason: '',
                      state: 'EXECUTED',
                      choices: {},
                      medias: [],
                      parameterValueApprovalDto: null,
                    },
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
          },
        },
      ]}
    />
  );
};

export default ResourceTaskView;
