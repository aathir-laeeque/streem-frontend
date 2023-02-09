import { Button, FormGroup } from '#components';
import { MandatoryParameter, ParameterType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters } from '#utils/apiUrls';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { ObjectType } from '#views/Ontology/types';
import { LinkOffOutlined, LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CommonWrapper } from './styles';

const ResourceParameter: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: {
      data: processData,
      parameters: { listById },
    },
    ontology: {
      objectTypes: { list, listLoading, pageable },
    },
  } = useTypedSelector((state) => state);
  const { id: checklistId } = processData!;
  const { register, watch, setValue } = form;
  const data = watch('data', {});
  const autoInitialized = watch('autoInitialized', false);
  const autoInitialize = watch('autoInitialize', {});
  const [loading, setLoading] = useState<Boolean>(false);
  const [resourceParameters, setResourceParameters] = useState<
    { id: string; type: ParameterType; label: string; taskId: string }[]
  >([]);
  const [loadingProperties, setLoadingProperties] = useState<Boolean>(false);
  const [objectProperties, setObjectProperties] = useState<any[]>([]);

  const fetchData = (page: number) => {
    dispatch(
      fetchObjectTypes(
        {
          page,
          size: DEFAULT_PAGE_SIZE,
          usageStatus: 1,
        },
        true,
      ),
    );
  };

  const handleMenuScrollToBottom = () => {
    if (!listLoading && !pageable.last) {
      fetchData(pageable.page + 1);
    }
  };

  const fetchResourceParameters = async () => {
    if (checklistId) {
      setLoading(true);
      const resources = await request('GET', apiGetParameters(checklistId), {
        params: {
          filters: {
            op: FilterOperators.AND,
            fields: [
              {
                field: 'archived',
                op: FilterOperators.EQ,
                values: [false],
              },
              {
                field: 'type',
                op: FilterOperators.EQ,
                values: [MandatoryParameter.RESOURCE],
              },
            ],
          },
        },
      });
      setResourceParameters(resources.data || []);
      setLoading(false);
    }
  };

  const getProperties = async (id: string) => {
    setLoadingProperties(true);
    const response: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
    if (response?.data?.relations) {
      setObjectProperties(
        response.data.relations.filter(
          (relation: any) => relation.externalId === data?.objectTypeExternalId,
        ) || [],
      );
    }
    setLoadingProperties(false);
  };

  useEffect(() => {
    register('data', {
      required: true,
    });

    register('autoInitialized');

    if (!list.length) fetchData(0);
    if (
      autoInitialize?.parameterId &&
      listById?.[autoInitialize?.parameterId]?.data?.objectTypeId
    ) {
      getProperties(listById[autoInitialize.parameterId].data.objectTypeId);
    }
  }, []);

  const renderLinkingSection = () => {
    register('autoInitialize', {
      validate: (value) => {
        return value ? 'parameterId' in value && 'relation' in value : true;
      },
    });
    return (
      <>
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'resourceParameter',
                label: 'Resource Parameter',
                isLoading: loading,
                onMenuScrollToBottom: handleMenuScrollToBottom,
                options: resourceParameters.map((parameter) => ({
                  ...parameter,
                  value: parameter.id,
                })),
                defaultValue: autoInitialize?.parameterId
                  ? [
                      {
                        label: listById?.[autoInitialize.parameterId]?.label,
                        value: autoInitialize.parameterId,
                      },
                    ]
                  : undefined,
                isSearchable: false,
                placeholder: 'Select',
                isDisabled: isReadOnly,
                onChange: (value: any) => {
                  setValue(
                    'autoInitialize',
                    {
                      parameterId: value.id,
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                  getProperties(value.data.objectTypeId);
                },
              },
            },
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'resourceParameter',
                label: 'Object Property to be linked',
                isLoading: loadingProperties,
                onMenuScrollToBottom: handleMenuScrollToBottom,
                options: objectProperties.map((properties) => ({
                  ...properties,
                  label: properties.displayName,
                  value: properties.id,
                })),
                defaultValue: autoInitialize?.relation
                  ? [
                      {
                        label: autoInitialize.relation?.displayName,
                        value: autoInitialize.relation?.id,
                        externalId: autoInitialize.relation?.externalId,
                      },
                    ]
                  : undefined,
                isSearchable: false,
                placeholder: 'Select',
                isDisabled: isReadOnly,
                onChange: (value: any) => {
                  setValue(
                    'autoInitialize',
                    {
                      ...autoInitialize,
                      relation: {
                        id: value.id,
                        displayName: value.displayName,
                        externalId: value.externalId,
                      },
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                },
              },
            },
          ]}
        />
        <Button
          type="button"
          variant="textOnly"
          color="red"
          style={{ padding: '8px', marginBlock: 16 }}
          onClick={() => {
            setValue('autoInitialized', false);
            setValue('autoInitialize', null, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          <LinkOffOutlined style={{ marginRight: 8 }} /> Remove Link
        </Button>
      </>
    );
  };

  return (
    <CommonWrapper>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'objectType',
              label: 'Object Type',
              isLoading: listLoading,
              onMenuScrollToBottom: handleMenuScrollToBottom,
              options: list.map((objectType) => ({
                ...objectType,
                label: objectType.displayName,
                value: objectType.id,
              })),
              defaultValue: data?.objectTypeId
                ? [
                    {
                      label: data?.objectTypeDisplayName,
                      value: data?.objectTypeId,
                    },
                  ]
                : undefined,
              isSearchable: false,
              placeholder: 'Select Object Type',
              isDisabled: isReadOnly,
              onChange: (value: any) => {
                setValue(
                  'data',
                  {
                    urlPath: `/objects/partial?collection=${value.externalId}`,
                    collection: value.externalId,
                    objectTypeId: value.id,
                    objectTypeExternalId: value.externalId,
                    objectTypeDisplayName: value.displayName,
                    propertyValidations: [],
                  },
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              },
            },
          },
        ]}
      />
      <h5>Link to a Resource Parameters Property</h5>
      <h6>
        This Parameter will get auto initialized with the value of on Object Property of Resource
        Parameter. The Type of the linked object property should match the type of this Parameter
      </h6>
      {!isReadOnly && !autoInitialized && (
        <Button
          type="button"
          variant="secondary"
          style={{ padding: '8px', marginBlock: 16 }}
          onClick={() => {
            fetchResourceParameters();
            setValue('autoInitialized', true, {
              shouldDirty: true,
            });
          }}
        >
          <LinkOutlined style={{ marginRight: 8 }} /> Link Resource
        </Button>
      )}
      {autoInitialized && renderLinkingSection()}
    </CommonWrapper>
  );
};

export default ResourceParameter;
