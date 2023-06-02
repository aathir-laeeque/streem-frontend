import { Button, FormGroup } from '#components';
import { MandatoryParameter, ParameterType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters } from '#utils/apiUrls';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { ObjectType } from '#views/Ontology/types';
import { LinkOffOutlined, LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { CommonWrapper } from './styles';

const LinkParameter: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const {
    prototypeComposer: {
      data: processData,
      parameters: { listById },
    },
  } = useTypedSelector((state) => state);
  const { id: checklistId, parameters: cjfParameters } = processData!;
  const { register, watch, setValue } = form;
  const type = watch('type', {});
  const autoInitialized = watch('autoInitialized', false);
  const autoInitialize = watch('autoInitialize', {});
  const [loading, setLoading] = useState<Boolean>(false);
  const [resourceParameters, setResourceParameters] = useState<
    { id: string; type: ParameterType; label: string; taskId: string }[]
  >([]);
  const [loadingProperties, setLoadingProperties] = useState<Boolean>(false);
  const [objectProperties, setObjectProperties] = useState<any[]>([]);
  const pagination = useRef({
    current: -1,
    isLast: false,
  });

  const fetchResourceParameters = async () => {
    if (checklistId && !loading && !pagination.current.isLast) {
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
      if (resources.pageable) {
        pagination.current = {
          current: resources.pageable?.page,
          isLast: resources.pageable?.last,
        };
      }
      setResourceParameters(resources.data || []);
      setLoading(false);
    }
  };

  const getProperties = async (id: string) => {
    setLoadingProperties(true);
    const response: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
    if (response?.data?.properties) {
      setObjectProperties(
        response.data.properties.filter((property) => property.inputType === type) || [],
      );
    }
    setLoadingProperties(false);
  };

  const onRemoveLink = () => {
    setValue('autoInitialized', false);
    setValue('autoInitialize', null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const referencedParameter =
    listById?.[autoInitialize?.parameterId] ||
    cjfParameters?.find((currParam) => currParam?.id === autoInitialize?.parameterId);

  useEffect(() => {
    register('autoInitialized');
    if (autoInitialize?.parameterId && referencedParameter?.data?.objectTypeId) {
      getProperties(referencedParameter?.data?.objectTypeId);
    }
  }, []);

  const renderLinkingSection = () => {
    register('autoInitialize', {
      validate: (value) => {
        return value ? 'parameterId' in value && 'property' in value : true;
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
                options: resourceParameters.map((parameter) => ({
                  ...parameter,
                  value: parameter.id,
                })),
                defaultValue: autoInitialize?.parameterId
                  ? [
                      {
                        label: referencedParameter?.label,
                        value: autoInitialize.parameterId,
                      },
                    ]
                  : undefined,
                isSearchable: false,
                onMenuScrollToBottom: fetchResourceParameters,
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
                options: objectProperties.map((properties) => ({
                  externalId: properties.externalId,
                  label: properties.displayName,
                  value: properties.id,
                })),
                defaultValue: autoInitialize?.property
                  ? [
                      {
                        label: autoInitialize?.property?.displayName,
                        value: autoInitialize?.property?.id,
                        externalId: autoInitialize?.property?.externalId,
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
                      property: {
                        id: value.value,
                        displayName: value.label,
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
        {!isReadOnly && (
          <Button
            type="button"
            variant="textOnly"
            color="red"
            style={{ padding: '8px', marginBlock: 16 }}
            onClick={onRemoveLink}
          >
            <LinkOffOutlined style={{ marginRight: 8 }} /> Remove Link
          </Button>
        )}
      </>
    );
  };

  return (
    <CommonWrapper>
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

export default LinkParameter;
