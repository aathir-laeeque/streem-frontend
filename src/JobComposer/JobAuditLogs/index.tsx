import { Checkbox, FilterProp, Link as GoBack, InfiniteListView } from '#components';
import { useTypedSelector } from '#store';
import { clearAuditLogFilters, setAuditLogFilters } from '#store/audit-log-filters/action';
import { fetchUsers } from '#store/users/actions';
import { User, UsersListType } from '#store/users/types';
import { openLinkInNewTab } from '#utils';
import { FilterOperators } from '#utils/globalTypes';
import { getInitials } from '#utils/stringUtils';
import { usePrevious } from '#utils/usePrevious';
import { Job } from '#views/Jobs/ListView/types';
import TextField from '@material-ui/core/TextField';
import { Search } from '@material-ui/icons';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  DateRange,
  DateRangeDelimiter,
  LocalizationProvider,
  StaticDateRangePicker,
  TimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { RouteComponentProps } from '@reach/router';
import { groupBy } from 'lodash';
import moment, { Moment } from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchJobAuditLogs } from './actions';
import { Composer, UserFilterWrapper } from './styles';
import { JobAuditLogType, JobAuditLogState } from './types';

type initialState = {
  dateRange: DateRange<Moment>;
  appliedFilters: Record<string, boolean>;
  startTime: Moment | null;
  endTime: Moment | null;
  searchQuery: string;
  selectedUsers: User[];
  unSelectedUsers: User[];
  appliedUsers: User[];
};

// TODO Change appliedUsers, selectedUsers, unSelectedUsers to HashMap as we only need the id's of the users So we can keep it like { userId : boolean }.
const currentDate = moment().startOf('day');
const initialState: initialState = {
  dateRange: [null, null],
  appliedFilters: {},
  startTime: currentDate,
  endTime: moment().endOf('day'),
  searchQuery: '',
  selectedUsers: [],
  unSelectedUsers: [],
  appliedUsers: [],
};

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

const AuditLogs: FC<Props> = ({ jobId }) => {
  const { logs, loading, pageable }: JobAuditLogState = useTypedSelector(
    (state) => state.composer.auditLogs,
  );
  const { selectedFacility } = useTypedSelector((state) => state.auth);
  const { timeFormat: timeFormat, dateFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );
  const {
    list,
    pageable: { last, page },
  } = useTypedSelector((state) => state.users.all);

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);
  const { searchQuery, selectedUsers, unSelectedUsers, appliedUsers } = state;

  const prevSearch = usePrevious(searchQuery);

  const resetFilter = () => {
    setstate(initialState);
    dispatch(clearAuditLogFilters());
  };

  const onCheckChanged = (user: User, checked: boolean) => {
    if (checked) {
      const newSelected = selectedUsers.filter((u) => user.id !== u.id);
      setstate({
        ...state,
        selectedUsers: newSelected,
        unSelectedUsers: [...unSelectedUsers, user],
      });
    } else {
      const newUnSelected = unSelectedUsers.filter((u) => user.id !== u.id);
      setstate({
        ...state,
        unSelectedUsers: newUnSelected,
        selectedUsers: [...selectedUsers, user],
      });
    }
  };

  const userRow = (user: User, checked: boolean) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          <Checkbox checked={checked} label="" onClick={() => onCheckChanged(user, checked)} />
        </div>
        <div className="thumb">{getInitials(`${user.firstName} ${user.lastName}`)}</div>
        <div className="middle">
          <span className="userId">{user.employeeId}</span>
          <span className="userName">{`${user.firstName} ${user.lastName}`}</span>
        </div>
      </div>
    );
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7 && !last)
      fetchUsersData(page + 1, 10);
  };

  const handleUnselectAll = () => {
    setstate({
      ...state,
      unSelectedUsers: [],
      selectedUsers: [],
      appliedUsers: [],
    });
  };

  const filterProp: FilterProp = {
    filters: [
      {
        label: 'Date/Time Range',
        onApply: () => {
          setstate({
            ...state,
            appliedFilters: {
              ...state.appliedFilters,
              'Date/Time Range': true,
            },
          });
        },
        content: (
          <LocalizationProvider dateAdapter={MomentUtils}>
            <StaticDateRangePicker
              displayStaticWrapperAs="desktop"
              value={state.dateRange}
              calendars={1}
              onChange={(newValue) => setstate({ ...state, dateRange: newValue })}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <DateRangeDelimiter> to </DateRangeDelimiter>
                  <TextField {...endProps} />
                </>
              )}
            />
            <div className="timepicker-container">
              <TimePicker
                renderInput={(props) => <TextField {...props} />}
                ampm={false}
                showToolbar={false}
                label="Start Time"
                value={state.startTime}
                InputProps={{
                  startAdornment: <AccessTimeIcon />,
                }}
                openPickerIcon={<ArrowDropDownIcon />}
                onChange={(newValue) => setstate({ ...state, startTime: newValue })}
              />
              <TimePicker
                renderInput={(props) => <TextField {...props} />}
                ampm={false}
                label="End Time"
                value={state.endTime}
                InputProps={{
                  startAdornment: <AccessTimeIcon />,
                }}
                openPickerIcon={<ArrowDropDownIcon />}
                onChange={(newValue) => setstate({ ...state, endTime: newValue })}
              />
            </div>
          </LocalizationProvider>
        ),
      },
      {
        label: 'Users',
        onApply: () => {
          const applicapleUsers = [
            ...selectedUsers,
            ...appliedUsers.filter((user) => !unSelectedUsers.some((item) => item.id === user.id)),
          ];
          if (!!applicapleUsers.length) {
            setstate({
              ...state,
              appliedFilters: {
                ...state.appliedFilters,
                Users: true,
              },
              appliedUsers: applicapleUsers,
              selectedUsers: [],
              unSelectedUsers: [],
            });
          } else {
            setstate({
              ...state,
              appliedFilters: {
                ...state.appliedFilters,
                Users: false,
              },
              appliedUsers: [],
              selectedUsers: [],
              unSelectedUsers: [],
            });
          }
        },
        content: function template() {
          const bodyView: JSX.Element[] = [];

          if (list) {
            if (searchQuery === '') {
              appliedUsers.forEach((user) => {
                const isUnSelected = !unSelectedUsers.some((item) => item.id === user.id);
                bodyView.push(userRow(user, isUnSelected));
              });
            }

            (list as unknown as Array<User>).forEach((user) => {
              const isSelected = selectedUsers.some((item) => item.id === user.id);
              const inApplied = appliedUsers.some((item) => item.id === user.id);
              if (!inApplied) {
                bodyView.push(userRow(user, isSelected));
              }
            });
          }
          return (
            <UserFilterWrapper>
              <div className="top-content">
                <div className="searchboxwrapper">
                  <Search className="searchsubmit" />
                  <input
                    className="searchbox"
                    type="text"
                    onChange={(e) => setstate({ ...state, searchQuery: e.target.value })}
                    defaultValue={searchQuery}
                    placeholder="Search Users"
                  />
                </div>
                <span onClick={handleUnselectAll}>Unselect All</span>
              </div>
              <div className="scrollable-content" onScroll={handleOnScroll}>
                {bodyView}
              </div>
            </UserFilterWrapper>
          );
        },
      },
    ],
    onReset: () => resetFilter(),
    activeCount: Object.keys(state.appliedFilters).filter((key) => !!state.appliedFilters[key])
      .length,
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuditLogFilters());
    };
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [state.appliedFilters]);

  useEffect(() => {
    if (prevSearch !== searchQuery) {
      fetchUsersData(0, 10);
    }
  }, [searchQuery]);

  const fetchUsersData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: FilterOperators.AND,
      fields: [{ field: 'firstName', op: FilterOperators.LIKE, values: [searchQuery] }],
    });
    dispatch(fetchUsers({ page, size, filters }, UsersListType.ALL));
  };

  const fetchLogs = (page = 0, size = 250) => {
    size = 250;
    const { dateRange, startTime, endTime } = state;
    let greaterDate = moment().startOf('day').subtract(7, 'days');
    let lowerDate = moment().endOf('day');
    if (dateRange[0]) {
      greaterDate = dateRange[0];
      lowerDate = dateRange[0];
      if (dateRange[1]) {
        lowerDate = dateRange[1];
      }
    }
    if (greaterDate && lowerDate && startTime && endTime) {
      const greaterThan = moment(
        `${greaterDate.format('YYYY-MM-DD')} ${startTime.format('HH:mm')}`,
      ).unix();
      const lowerThan = moment(
        `${lowerDate.format('YYYY-MM-DD')} ${endTime.format('HH:mm')}`,
      ).unix();

      const userFilter = appliedUsers.map((u) => u.id);
      const fields = [
        {
          field: 'triggeredAt',
          op: FilterOperators.LOE,
          values: [lowerThan],
        },
        {
          field: 'triggeredBy',
          op: FilterOperators.ANY,
          values: userFilter,
        },
      ];

      if (state.appliedFilters['Date/Time Range']) {
        fields.push({
          field: 'triggeredAt',
          op: FilterOperators.GOE,
          values: [greaterThan],
        });
      }

      const filters = JSON.stringify({
        op: FilterOperators.AND,
        fields,
      });

      dispatch(setAuditLogFilters(filters));

      if (jobId) {
        dispatch(
          fetchJobAuditLogs({
            jobId,
            params: { size, filters, sort: 'triggeredAt,desc', page },
          }),
        );
      }
    }
  };

  if (!logs || !pageable) {
    return <div>{loading && 'Loading...'}</div>;
  }

  const grouped: { [index: string]: JobAuditLogType[] } = groupBy(logs, 'triggeredOn');
  const data = Object.keys(grouped).map((item) => ({
    [item]: grouped[item],
    id: item,
  }));

  return (
    <Composer>
      <GoBack label="Return to process" className="go-back" />
      <div className="audit-logs-wrapper">
        <InfiniteListView
          isSearchable={false}
          fetchData={fetchLogs}
          isLast={pageable.last}
          currentPage={pageable.page}
          data={data}
          onPrimaryClick={() => openLinkInNewTab(`/job-activity/${jobId}/print`)}
          primaryButtonText="Export"
          filterProp={filterProp}
          beforeColumns={[
            {
              header: 'TIME',
              template: function renderComp(item) {
                const day = moment(Object.keys(item)[0]).format(dateFormat);
                const itemId = item.id as string;

                return (
                  <div className="list-card-columns" key={`name_${itemId}`}>
                    <div style={{ padding: '0px 8px', flex: 1 }}>
                      <div className="log-header">
                        <div className="header-item">{day}</div>
                        <div className="header-item">{item[itemId].length} parameters</div>
                      </div>
                      <div className="log-row">
                        {(item[itemId] as JobAuditLogType[]).map((log) => (
                          <div className="log-item" key={`${log.id}`}>
                            <div className="circle" />
                            <div className="content">
                              <div className="content-items" style={{ whiteSpace: 'nowrap' }}>
                                {moment.unix(log.triggeredAt).format(timeFormat)}
                              </div>
                              <div className="content-items">{log.details}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </Composer>
  );
};

export default AuditLogs;
