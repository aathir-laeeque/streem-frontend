import {
  Button,
  DataTable,
  LoadingContainer,
  Pagination,
  TextInput,
  Select,
  Checkbox,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { fetchParameters, toggleNewParameter } from '#PrototypeComposer/Activity/actions';
import { MandatoryParameter, TargetEntityType } from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap, TargetEntityTypeVisual } from '#PrototypeComposer/constants';
import { TabPanelWrapper } from '#PrototypeComposer/styles';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { fetchDataParams, FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import tickIcon from '../../assets/svg/tickIcon.svg';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const CustomTooltip = withStyles({
  tooltip: {
    width: '205px',
    backgroundColor: '#393939',
    borderRadius: '0px',
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
  },
  arrow: {
    color: '#393939',
  },
})(Tooltip);

const ParametersList: FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => {
  const {
    data,
    parameters: {
      parameters: { list, listLoading, pageable },
    },
  } = useTypedSelector((state) => state.prototypeComposer);
  const dispatch = useDispatch();
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
  }, [filterFields]);

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
      <CustomTooltip
        title={
          item.targetEntityType === TargetEntityType.PROCESS
            ? 'Verification are not applicable for Parameters in the Create Job Form'
            : 'Verification are not applicable for Parameters in a published Checklist'
        }
        arrow
      >
        <span>NA</span>
      </CustomTooltip>
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

    if (verificationTypes?.length > 0) {
      setFilterFields((prev) => [
        ...prev.filter((field) => field.field !== 'verificationType'),
        {
          field: 'verificationType',
          op: FilterOperators.ANY,
          values: verificationTypes,
        },
      ]);
    } else {
      setFilterFields((prev) => [...prev.filter((field) => field.field !== 'verificationType')]);
    }
  };

  return (
    <TabPanelWrapper>
      <TabContentWrapper>
        <div className="filters" style={{ padding: '0 0 16px' }}>
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
          <div style={{ marginLeft: '16px', width: '240px' }}>
            <Select
              placeholder="Select Verification Type"
              options={options}
              hideSelectedOptions={false}
              isClearable={true}
              onChange={debounce((option) => handleVerificationTypeFilter(option), 500)}
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
                emptyTitle="Parameters Found"
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
