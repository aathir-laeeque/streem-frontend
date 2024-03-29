import { FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { InputTypes, fetchDataParams } from '#utils/globalTypes';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { debounce } from 'lodash';
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
    ontology: {
      objectTypes: { list, listLoading, pageable },
    },
  } = useTypedSelector((state) => state);
  const { watch, setValue } = form;
  const data = watch('data', {});
  const autoInitialized = watch('autoInitialized', false);

  const fetchData = (params: fetchDataParams = {}, appendData: boolean = false) => {
    const { page = DEFAULT_PAGE_NUMBER, query = '' } = params;
    dispatch(
      fetchObjectTypes(
        {
          page,
          size: DEFAULT_PAGE_SIZE,
          usageStatus: 1,
          displayName: query ? query : null,
        },
        appendData,
      ),
    );
  };

  const handleMenuScrollToBottom = () => {
    if (!listLoading && !pageable.last) {
      fetchData({ page: pageable.page + 1 }, true);
    }
  };

  const onRemoveLink = () => {
    setValue('autoInitialized', false);
    setValue('autoInitialize', null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (!list.length) fetchData({ page: 0 });
  }, []);

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
              onInputChange: debounce((value: string, actionMeta: string) => {
                if (value !== actionMeta.prevInputValue) {
                  fetchData({
                    query: value,
                  });
                }
              }, 500),
              defaultValue: data?.objectTypeId
                ? [
                    {
                      label: data?.objectTypeDisplayName,
                      value: data?.objectTypeId,
                    },
                  ]
                : undefined,
              isSearchable: true,
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
                if (autoInitialized) {
                  onRemoveLink();
                }
              },
            },
          },
        ]}
      />
    </CommonWrapper>
  );
};

export default ResourceParameter;
