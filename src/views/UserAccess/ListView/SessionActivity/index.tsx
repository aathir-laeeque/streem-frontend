import React, { FC, useEffect, useState } from 'react';
import { ListViewComponent, FilterProp, Checkbox } from '#components';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import {
  SessionActivity as SessionActivityType,
  SessionActivityState,
  SessionActivitySeverity,
} from './types';
import { groupBy } from 'lodash';
import moment, { Moment } from 'moment';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';
import { fetchSessionActivities } from './actions';
import { useDispatch } from 'react-redux';
import { Composer, UserFilterWrapper } from './styles';
import { TabViewProps } from '../types';
import TextField from '@material-ui/core/TextField';
import {
  StaticDateRangePicker,
  DateRangeDelimiter,
  DateRange,
  LocalizationProvider,
  TimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  setActivityFilters,
  clearActivityFilters,
} from '#store/activity-filters/action';
import { User } from '#store/users/types';
import { getInitials } from '#utils/stringUtils';
import { Search } from '@material-ui/icons';
import { fetchUsers } from '#store/users/actions';
import { usePrevious } from '#utils/usePrevious';

type initialState = {
  dateRange: DateRange<Moment>;
  appliedFilters: Record<string, boolean>;
  startTime: Moment | null;
  endTime: Moment | null;
  searchQuery: string;
  selectedUsers: User[];
  appliedUsers: User[];
};

const currentDate = moment().startOf('day');
const initialState: initialState = {
  dateRange: [null, null],
  appliedFilters: {},
  startTime: currentDate,
  endTime: moment().endOf('day'),
  searchQuery: '',
  selectedUsers: [],
  appliedUsers: [],
};

const SessionActivity: FC<TabViewProps> = () => {
  const { logs, loading, pageable }: SessionActivityState = useTypedSelector(
    (state) => state.sessionActivity,
  );
  const {
    list,
    pageable: { last, page },
  } = useTypedSelector((state) => state.users.active);

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);
  const { searchQuery, selectedUsers, appliedUsers } = state;

  const prevSearch = usePrevious(searchQuery);

  const resetFilter = () => {
    setstate(initialState);
    dispatch(clearActivityFilters());
  };

  const onCheckChanged = (user: User, checked: boolean) => {
    if (checked) {
      const newSelected = selectedUsers.filter((u) => user.id !== u.id);
      setstate({ ...state, selectedUsers: newSelected });
    } else {
      setstate({ ...state, selectedUsers: [...selectedUsers, user] });
    }
  };

  const userRow = (user: User, checked: boolean) => {
    return (
      <div className="item" key={`user_${user.id}`}>
        <div className="right">
          <Checkbox
            checked={checked}
            label=""
            onClick={() => onCheckChanged(user, checked)}
          />
        </div>
        <div className="thumb">
          {getInitials(`${user.firstName} ${user.lastName}`)}
        </div>
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
    setstate({ ...state, selectedUsers: [], appliedUsers: [] });
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
              onChange={(newValue) =>
                setstate({ ...state, dateRange: newValue })
              }
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
                onChange={(newValue) =>
                  setstate({ ...state, startTime: newValue })
                }
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
                onChange={(newValue) =>
                  setstate({ ...state, endTime: newValue })
                }
              />
            </div>
          </LocalizationProvider>
        ),
      },
      {
        label: 'Users',
        onApply: () => {
          if (selectedUsers.length > 0 || appliedUsers.length > 0) {
            setstate({
              ...state,
              appliedFilters: {
                ...state.appliedFilters,
                Users: true,
              },
              appliedUsers: selectedUsers,
            });
          } else {
            resetFilter();
          }
        },
        content: function template() {
          const bodyView: JSX.Element[] = [];

          if (list) {
            if (searchQuery === '') {
              appliedUsers.forEach((user) => {
                bodyView.push(userRow(user, true));
              });
            }

            ((list as unknown) as Array<User>).forEach((user) => {
              const isSelected = selectedUsers.some(
                (item) => item.id === user.id,
              );
              const inApplied = appliedUsers.some(
                (item) => item.id === user.id,
              );
              if (user.id !== '0') {
                if (!inApplied) {
                  bodyView.push(userRow(user, isSelected));
                }
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
                    onChange={(e) =>
                      setstate({ ...state, searchQuery: e.target.value })
                    }
                    defaultValue={searchQuery}
                    placeholder="First Name"
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
    activeCount: Object.keys(state.appliedFilters).length,
  };

  useEffect(() => {
    return () => {
      dispatch(clearActivityFilters());
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
      op: 'AND',
      fields: [{ field: 'firstName', op: 'LIKE', values: [searchQuery] }],
    });
    dispatch(fetchUsers({ page, size, filters, sort: 'id' }, 'active'));
  };

  const fetchLogs = (page = 0, size = 250) => {
    size = 250;
    const { dateRange, startTime, endTime } = state;
    let greaterDate = moment().startOf('day').subtract(7, 'days');
    let lowerDate = moment().endOf('day');
    if (dateRange[0] && dateRange[1]) {
      greaterDate = dateRange[0];
      lowerDate = dateRange[1];
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
          op: 'LOE',
          values: [lowerThan],
        },
        {
          field: 'triggeredBy',
          op: 'ANY',
          values: userFilter,
        },
      ];

      if (state.appliedFilters['Date/Time Range']) {
        fields.push({
          field: 'triggeredAt',
          op: 'GOE',
          values: [greaterThan],
        });
      }

      const filters = JSON.stringify({
        op: 'AND',
        fields,
      });

      dispatch(setActivityFilters(filters));

      dispatch(
        fetchSessionActivities({
          size,
          filters,
          sort: 'triggeredAt,desc',
          page,
        }),
      );
    }
  };

  if (!logs || !pageable) {
    return <div>{loading && 'Loading...'}</div>;
  }

  const grouped = groupBy(logs, 'triggeredOn');
  const data = [] as Record<string, string | SessionActivityType[]>[];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

  return (
    <Composer>
      <ListViewComponent
        isSearchable={false}
        properties={[]}
        fetchData={fetchLogs}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={data}
        onPrimaryClick={() => window.open(`users-activity/print`, '_blank')}
        primaryButtonText="Export"
        filterProp={filterProp}
        beforeColumns={[
          {
            header: 'TIME',
            template: function renderComp(item) {
              const day = moment(Object.keys(item)[0]).format('MMM Do, YYYY');
              let criticalCount = 0;
              item[item.id].forEach((element: SessionActivityType) => {
                if (element.severity === SessionActivitySeverity.CRITICAL)
                  criticalCount++;
              });
              return (
                <div className="list-card-columns" key={`name_${item.id}`}>
                  <div style={{ padding: '0px 8px', flex: 1 }}>
                    <div className="log-header">
                      <div className="header-item">{day}</div>
                      <div className="header-item">
                        {item[item.id].length} activities
                      </div>
                      {criticalCount !== 0 && (
                        <>
                          <div className="header-item">
                            <ReportProblemOutlinedIcon className="icon" />
                          </div>
                          <div className="header-item">
                            {criticalCount} Critical
                          </div>
                        </>
                      )}
                    </div>
                    <div className="log-row">
                      {item[item.id].map((log: SessionActivityType) => (
                        <div className="log-item" key={`${log.id}`}>
                          <div className="circle" />
                          <div className="content">
                            <div className="content-items">
                              {moment.unix(log.triggeredAt).format('hh:mm A')}
                            </div>
                            {log.severity ===
                              SessionActivitySeverity.CRITICAL && (
                              <div className="content-items">
                                <ReportProblemOutlinedIcon className="icon" />
                              </div>
                            )}
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
    </Composer>
  );
};

export default SessionActivity;
