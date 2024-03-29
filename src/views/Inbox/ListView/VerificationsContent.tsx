import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import rightArrow from '#assets/svg/right-arrow.svg';
import {
  Avatar,
  Checkbox,
  DataTable,
  LoadingContainer,
  Pagination,
  ResourceFilter,
  TextInput,
} from '#components';
import { closeOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { Select } from '#components/shared/Select';
import { defaultParams, useUsers } from '#services/users';
import { useTypedSelector } from '#store';
import { ParameterVerificationStatus } from '#types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, InputTypes, fetchDataParams } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { FiberManualRecord, Search } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { InputActionMeta, components } from 'react-select';
import styled from 'styled-components';
import { fetchVerifications, fetchVerificationsSuccess } from './actions';

const options = [
  {
    label: 'Pending',
    value: ParameterVerificationStatus.PENDING,
  },
  {
    label: 'Approved',
    value: ParameterVerificationStatus.ACCEPTED,
  },
  {
    label: 'Rejected',
    value: ParameterVerificationStatus.REJECTED,
  },
  {
    label: 'Recalled',
    value: ParameterVerificationStatus.RECALLED,
  },
];

const Option = (props: any) => {
  const CheckboxWrapper = styled.div`
    .checkmark {
      background-color: #fff;
      border-color: #333;
      border-radius: 0;
      border-width: 2px;
    }

    .container {
      color: #525252;
    }

    input:checked ~ .checkmark {
      background-color: #1d84ff;
      border: none;
    }
  `;

  return (
    <div>
      <components.Option {...props}>
        <CheckboxWrapper>
          <Checkbox onClick={() => null} label={props.label} checked={props.isSelected} />
        </CheckboxWrapper>
      </components.Option>
    </div>
  );
};

const renderVerificationStatus = (status: string) => {
  let statusText = 'Pending';
  let indicatorColor = '#F1C21B';

  if (status === ParameterVerificationStatus.ACCEPTED) {
    statusText = 'Approved';
    indicatorColor = '#24A148';
  } else if (status === ParameterVerificationStatus.REJECTED) {
    statusText = 'Rejected';
    indicatorColor = '#DA1E28';
  } else if (status === ParameterVerificationStatus.RECALLED) {
    statusText = 'Recalled';
    indicatorColor = '#C2C2C2';
  } else {
    statusText = 'Pending';
    indicatorColor = '#F1C21B';
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <FiberManualRecord
        style={{
          fontSize: '8px',
          color: indicatorColor,
        }}
      />
      <div>{statusText}</div>
    </div>
  );
};

const VerificationsContent: FC<{
  values?: { userId?: string; jobId?: string; isJobOpen?: boolean; redirectedFromBanner?: boolean };
}> = ({ values = {} }) => {
  const { userId: requestedTo, jobId, isJobOpen, redirectedFromBanner } = values;

  const { users, loadMore, loadAgain } = useUsers({
    params: { ...defaultParams(false) },
  });

  const dispatch = useDispatch();
  const {
    inboxListView: {
      verifications: { loading, list, pageable },
    },
    job: { parameterResponseById },
    // auth: { userId: loggedInUserId },
  } = useTypedSelector((state) => state);

  // const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filters, setFilters] = useState<any>({
    requestedTo: !isJobOpen || redirectedFromBanner ? requestedTo : undefined,
    jobId,
    status: ParameterVerificationStatus.PENDING,
  });
  const [resourceFilter, setResourceFilter] = useState<string>('');

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(fetchVerificationsSuccess());
    };
  }, [filters, resourceFilter]);

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchVerifications({
        params: {
          page,
          size,
          ...(resourceFilter && { objectId: resourceFilter }),
          ...filters,
        },
      }),
    );
  };

  const onChildChange = (option: any) => {
    setResourceFilter(option.id);
  };

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ width: '280px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search by Parameter name`}
            onChange={debounce((option) => {
              setFilters((prev) => ({
                ...prev,
                parameterName: option?.value,
              }));
            }, 500)}
          />
        </div>
        <div className="select-filter">
          <Select
            placeholder="Select"
            label="Requested By"
            options={
              users?.map((user) => ({
                value: user.id,
                label: user?.firstName + ' ' + user?.lastName,
                externalId: <div>&nbsp;(ID: {user?.employeeId})</div>,
              })) as any
            }
            onChange={(data) => {
              setFilters((prev) => ({
                ...prev,
                requestedBy: data?.value,
              }));
            }}
            onInputChange={debounce((newValue: string, actionMeta: InputActionMeta) => {
              if (newValue !== actionMeta.prevInputValue) {
                loadAgain({
                  newParams: {
                    ...defaultParams(),
                    filters: JSON.stringify({
                      op: 'OR',
                      fields: [
                        {
                          field: 'firstName',
                          op: FilterOperators.LIKE,
                          values: [newValue],
                        },
                        {
                          field: 'lastName',
                          op: FilterOperators.LIKE,
                          values: [newValue],
                        },
                        {
                          field: 'employeeId',
                          op: FilterOperators.LIKE,
                          values: [newValue],
                        },
                      ],
                    }),
                  },
                });
              }
            }, 500)}
            onMenuScrollToBottom={loadMore}
            isClearable={true}
            filterOption={() => true}
          />
        </div>
        {isJobOpen && !redirectedFromBanner && (
          <div className="select-filter">
            <Select
              placeholder="Select"
              label="Requested To"
              options={
                users?.map((user) => ({
                  value: user.id,
                  label: user?.firstName + ' ' + user?.lastName,
                  externalId: <div>&nbsp;(ID: {user?.employeeId})</div>,
                })) as any
              }
              onChange={(data) => {
                setFilters((prev) => ({
                  ...prev,
                  requestedTo: data?.value,
                }));
              }}
              onInputChange={debounce((newValue: string, actionMeta: InputActionMeta) => {
                if (newValue !== actionMeta.prevInputValue) {
                  loadAgain({
                    newParams: {
                      ...defaultParams(),
                      filters: JSON.stringify({
                        op: 'OR',
                        fields: [
                          {
                            field: 'firstName',
                            op: FilterOperators.LIKE,
                            values: [newValue],
                          },
                          {
                            field: 'lastName',
                            op: FilterOperators.LIKE,
                            values: [newValue],
                          },
                          {
                            field: 'employeeId',
                            op: FilterOperators.LIKE,
                            values: [newValue],
                          },
                        ],
                      }),
                    },
                  });
                }
              }, 500)}
              onMenuScrollToBottom={loadMore}
              isClearable={true}
              filterOption={() => true}
            />
          </div>
        )}
        <div className="select-filter">
          <Select
            placeholder="Select"
            options={options}
            components={{ Option }}
            hideSelectedOptions={false}
            label="Status"
            defaultValue={options.filter((el) => el.value === filters.status)}
            onChange={(option) => {
              setFilters((prev) => ({ ...prev, status: option?.value }));
            }}
            isClearable={true}
          />
        </div>
        {!jobId && (
          <div className="select-filter">
            <ResourceFilter onChange={onChildChange} onClear={() => setResourceFilter('')} />
          </div>
        )}
      </div>
      <LoadingContainer
        loading={loading}
        component={
          <>
            <DataTable
              columns={[
                {
                  id: 'paramterName',
                  label: 'Parameter Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.parameterName;
                  },
                },
                {
                  id: 'taskName',
                  label: 'Task Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.taskName;
                  },
                },
                {
                  id: 'processName',
                  label: 'Process Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.processName;
                  },
                },
                {
                  id: 'jobId',
                  label: 'Job ID',
                  minWidth: 100,
                  format: (item) => {
                    return item.code;
                  },
                },
                {
                  id: 'requestedByAndTo',
                  label: 'Requested By- Requested To',
                  minWidth: 100,
                  format: (item) => {
                    return (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Avatar
                          user={item?.createdBy}
                          color="blue"
                          backgroundColor="#F4F4F4"
                          borderColor="#FFFFFF"
                        />
                        <img src={rightArrow} alt="arrow" />
                        <Avatar
                          user={
                            item.verificationType === ParameterVerificationTypeEnum.SELF
                              ? item?.createdBy
                              : item?.requestedTo
                          }
                          color="blue"
                          backgroundColor="#F4F4F4"
                          borderColor="#FFFFFF"
                        />
                      </div>
                    );
                  },
                },
                {
                  id: 'verificationStatus',
                  label: 'Verification Status',
                  minWidth: 100,
                  format: (item) => renderVerificationStatus(item?.verificationStatus),
                },
                {
                  id: 'verificationType',
                  label: 'Verification Type',
                  minWidth: 100,
                  format: (item) => {
                    return item.verificationType === ParameterVerificationTypeEnum.PEER ? (
                      <div
                        style={{
                          backgroundColor: '#BAE6FF',
                          color: '#00539A',
                          padding: '4px 8px',
                          fontSize: '12px',
                          maxWidth: '48px',
                        }}
                      >
                        PEER
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: '#A7F0BA',
                          color: '#0E6027',
                          padding: '4px 8px',
                          fontSize: '12px',
                          maxWidth: '48px',
                        }}
                      >
                        SELF
                      </div>
                    );
                  },
                },
                {
                  id: 'requestedAt',
                  label: 'Requested At',
                  minWidth: 100,
                  format: (item) => {
                    return formatDateTime({ value: item?.createdAt, type: InputTypes.DATE_TIME });
                  },
                },
                {
                  id: 'action',
                  label: 'Action',
                  minWidth: 100,
                  format: (item) => {
                    const taskExecutionId = item.taskExecutionId;
                    return (
                      <span
                        className="primary"
                        onClick={() => {
                          if (isJobOpen) {
                            dispatch(
                              jobActions.navigateByTaskId({
                                id: taskExecutionId!,
                              }),
                            );
                            dispatch(closeOverlayAction(OverlayNames.JOB_VERIFICATION));
                          } else {
                            navigate(`/inbox/${item.jobId}`, {
                              state: {
                                taskExecutionId,
                              },
                            });
                          }
                        }}
                      >
                        View
                      </span>
                    );
                  },
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
  );
};

export default VerificationsContent;
