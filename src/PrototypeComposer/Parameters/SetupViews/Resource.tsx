import { formatOptionLabel, FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { InputTypes } from '#utils/globalTypes';
import { fetchObjectTypes } from '#views/Ontology/actions';
import React, { FC, useEffect } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { CommonWrapper } from './styles';

const ResourceParameter: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading, pageable },
  } = useTypedSelector((state) => state.ontology);
  const { register, watch, setValue } = form;
  const data = watch('data', {});

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

  useEffect(() => {
    if (!list.length) fetchData(0);
  }, []);

  register('data', {
    required: true,
  });

  return (
    <CommonWrapper>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'objectType',
              formatOptionLabel,
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
    </CommonWrapper>
  );
};

export default ResourceParameter;
