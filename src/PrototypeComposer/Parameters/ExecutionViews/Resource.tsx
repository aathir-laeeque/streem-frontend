import { Button, FormGroup } from '#components';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { apiGetObjects, baseUrl } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { LinkOutlined } from '@material-ui/icons';
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

  const { setValue, getValues, watch } = form;
  const parameterInForm = watch(`data.${parameter.id}`, {});

  const handleAutoInitialize = async () => {
    const formData = getValues();
    const dependentParameter = formData.data?.[parameter?.autoInitialize?.parameterId];
    console.log('dependentParameter', dependentParameter);
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
        `data.${parameter.id}`,
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

  return (
    <>
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
              onMenuScrollToBottom: () => {
                if (!isLoading && !pagination.current.isLast) {
                  getOptions();
                }
              },
              onChange: (value: any) => {
                const selectedOption = isArray(value.value) ? value.value : [value.value];
                setValue(
                  `data.${parameter.id}`,
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
              },
              isSearchable: false,
              placeholder: '',
              isDisabled: parameter?.autoInitialized,
              ...(parameter?.autoInitialized && {
                value: [
                  {
                    label: parameterInForm?.data?.choices?.[0]?.objectDisplayName,
                    externalId: parameterInForm?.data?.choices?.[0]?.objectExternalId,
                    value: parameterInForm?.data?.choices?.[0]?.objectId,
                  },
                ],
              }),
            },
          },
        ]}
      />
      {parameter?.autoInitialized && (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘Resource Parameter Name’
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
