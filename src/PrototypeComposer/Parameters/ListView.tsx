import { fetchParameters, toggleNewParameter } from '#PrototypeComposer/Activity/actions';
import {
  MandatoryParameter,
  ParameterVerificationTypeEnum,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import {
  ParameterLabelByType,
  ParameterTypeMap,
  TargetEntityTypeVisual,
} from '#PrototypeComposer/constants';
import { TabPanelWrapper } from '#PrototypeComposer/styles';
import { Button, DataTable, LoadingContainer, Pagination, Select, TextInput } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators, fetchDataParams } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import tickIcon from '../../assets/svg/tickIcon.svg';
import Tooltip from '#components/shared/Tooltip';

const ParametersList: FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => {
  const {
    data,
    parameters: {
      parameters: { list, listLoading, pageable, reRender },
    },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();
  const [parameterOptions, setParameterOptions] = useState<
    { label: string | JSX.Element; value: string }[]
  >([]);
  const [filterFields, setFilterFields] = useState<FilterField[]>([
    { field: 'archived', op: FilterOperators.EQ, values: [false] },
    {
      field: 'type',
      op: FilterOperators.ANY,
      values: Object.values(MandatoryParameter).filter(
        (type) => type !== MandatoryParameter.CHECKLIST,
      ),
    },
  ]);

  const fetchData = async (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    if (data?.id) {
      dispatch(
        fetchParameters(data.id, {
          page,
          size,
          filters: {
            op: FilterOperators.AND,
            fields: filterFields,
          },
          sort: 'id,desc',
        }),
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterFields, reRender]);

  useEffect(() => {
    setParameterOptions(
      Object.entries(ParameterTypeMap).map(([value, label]) => ({
        label,
        value,
      })),
    );
  }, []);

  const options = [
    {
      label: 'With Self-Verification',
      value: ParameterVerificationTypeEnum.SELF,
    },
    {
      label: 'With Peer-Verification',
      value: ParameterVerificationTypeEnum.PEER,
    },
    {
      label: 'With Both Verifications',
      value: ParameterVerificationTypeEnum.BOTH,
    },
    {
      label: 'No verifications',
      value: ParameterVerificationTypeEnum.NONE,
    },
  ];

  const renderVerificationType = (item: any, type: ParameterVerificationTypeEnum) => {
    const validTypes = [ParameterVerificationTypeEnum.BOTH, type];

    let verificationType = (
      <Tooltip
        title={
          item.targetEntityType === TargetEntityType.PROCESS
            ? 'Verification are not applicable for Parameters in the Create Job Form'
            : 'Verification are not applicable for Parameters in a published Checklist'
        }
        arrow
      >
        <span>NA</span>
      </Tooltip>
    );

    if (validTypes.includes(item?.verificationType)) {
      verificationType = <img src={tickIcon} alt="tick-icon" />;
    } else if (!isReadOnly && item?.targetEntityType !== TargetEntityType.PROCESS) {
      verificationType = (
        <span
          className="primary"
          onClick={() => {
            const titlePrefix = isReadOnly ? 'View' : 'Edit';
            dispatch(
              toggleNewParameter({
                action: 'list',
                title: `${titlePrefix} Process ${
                  item.type === MandatoryParameter.CHECKLIST
                    ? 'Subtask'
                    : item.type in MandatoryParameter
                    ? 'Parameter'
                    : 'Instruction'
                }`,
                parameterId: item.id,
                fetchData,
              }),
            );
          }}
        >
          Set
        </span>
      );
    }

    return verificationType;
  };

  const updateFilterField = (filedName: string, op: FilterOperators, value?: any) => {
    if (value) {
      setFilterFields((prev) => [
        ...prev.filter((field) => field.field !== filedName),
        {
          field: filedName,
          op,
          values: [value],
        },
      ]);
    } else {
      setFilterFields((prev) => [...prev.filter((field) => field.field !== filedName)]);
    }
  };

  const handleVerificationTypeFilter = (option: any) => {
    let verificationTypes: any[] = [];

    if (option?.value) {
      verificationTypes.push(option.value);
      if (
        verificationTypes?.includes(ParameterVerificationTypeEnum.SELF) ||
        verificationTypes?.includes(ParameterVerificationTypeEnum.PEER)
      ) {
        verificationTypes.push(ParameterVerificationTypeEnum.BOTH);
      }
    }

    updateFilterField(
      'verificationType',
      FilterOperators.ANY,
      verificationTypes.length ? verificationTypes : undefined,
    );
  };

  const parameterTypeFilter = useCallback((option, input) => {
    if (input && !ParameterLabelByType[option.value].toLowerCase().includes(input.toLowerCase())) {
      return false;
    }
    return true;
  }, []);

  return (
    <TabPanelWrapper>
      <TabContentWrapper>
        <div className="filters">
          <div style={{ maxWidth: 500 }}>
            <TextInput
              afterElementWithoutError
              AfterElement={Search}
              afterElementClass=""
              placeholder={`Search Parameter`}
              onChange={debounce(
                ({ value }) =>
                  setFilterFields((prev) => [
                    ...prev.filter((field) => field.field !== 'label'),
                    { field: 'label', op: FilterOperators.LIKE, values: [value] },
                  ]),
                500,
              )}
            />
          </div>
          <div style={{ width: '240px' }}>
            <Select
              placeholder="Select Verification Type"
              options={options}
              hideSelectedOptions={false}
              isClearable={true}
              onChange={debounce((option) => handleVerificationTypeFilter(option), 500)}
            />
          </div>
          <div style={{ width: '240px' }}>
            <Select
              placeholder="Select Location"
              options={Object.entries(TargetEntityTypeVisual).map(([value, label]) => ({
                label,
                value,
              }))}
              hideSelectedOptions={false}
              isClearable={true}
              onChange={debounce(
                (option) =>
                  updateFilterField('targetEntityType', FilterOperators.EQ, option?.value),
                500,
              )}
            />
          </div>
          <div style={{ width: '240px' }}>
            <Select
              placeholder="Select Type"
              options={parameterOptions}
              hideSelectedOptions={false}
              filterOption={parameterTypeFilter}
              isClearable={true}
              onChange={debounce(
                (option) => updateFilterField('type', FilterOperators.EQ, option?.value),
                500,
              )}
            />
          </div>
          {!isReadOnly && (
            <>
              <Button
                id="create"
                variant="secondary"
                onClick={() => {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.CONFIGURE_JOB_PARAMETERS,
                      props: {
                        checklistId: data?.id!,
                      },
                    }),
                  );
                }}
                style={{ marginRight: 16 }}
              >
                Configure 'Create job' form
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch(
                    toggleNewParameter({ action: 'list', title: 'Create a New Process Parameter' }),
                  );
                }}
                style={{ padding: '12px' }}
              >
                Create Parameter
              </Button>
            </>
          )}
        </div>
        <LoadingContainer
          loading={listLoading}
          component={
            <>
              <DataTable
                columns={[
                  {
                    id: 'label',
                    label: 'Process Parameter',
                    minWidth: 240,
                    format: (item) => {
                      return (
                        <span
                          className="primary"
                          onClick={() => {
                            const titlePrefix = isReadOnly ? 'View' : 'Edit';
                            dispatch(
                              toggleNewParameter({
                                action: 'list',
                                title: `${titlePrefix} Process ${
                                  item.type === MandatoryParameter.CHECKLIST
                                    ? 'Subtask'
                                    : item.type in MandatoryParameter
                                    ? 'Parameter'
                                    : 'Instruction'
                                }`,
                                parameterId: item.id,
                                fetchData,
                              }),
                            );
                          }}
                          title={item.label}
                        >
                          {item.label}
                        </span>
                      );
                    },
                  },
                  {
                    id: 'type',
                    label: 'Type',
                    minWidth: 152,
                    format: (item) => ParameterTypeMap[item.type],
                  },
                  {
                    id: 'targetEntityType',
                    label: 'Location',
                    minWidth: 152,
                    format: (item) => TargetEntityTypeVisual[item.targetEntityType],
                  },
                  {
                    id: 'mandatory',
                    label: 'Is Required?',
                    minWidth: 152,
                    format: (item) => (item.mandatory ? 'Yes' : 'No'),
                  },
                  {
                    id: 'selfVerification',
                    label: 'Self Verification',
                    minWidth: 152,
                    format: (item) =>
                      renderVerificationType(item, ParameterVerificationTypeEnum.SELF),
                  },
                  {
                    id: 'PeerVerification',
                    label: 'Peer Verification',
                    minWidth: 152,
                    format: (item) =>
                      renderVerificationType(item, ParameterVerificationTypeEnum.PEER),
                  },
                ]}
                rows={list}
                emptyTitle="No Parameters Found"
              />
              <Pagination pageable={pageable} fetchData={fetchData} />
            </>
          }
        />
      </TabContentWrapper>
    </TabPanelWrapper>
  );
};

export default ParametersList;
