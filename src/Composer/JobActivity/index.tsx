import React, { FC, useEffect, useState } from 'react';
import { ListViewComponent, FilterProp } from '#components';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { groupBy } from 'lodash';
import moment, { Moment } from 'moment';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import { Composer } from './styles';
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
import { JobActivity, JobActivitySeverity, JobActivityState } from './types';
import { fetchJobActivities } from './actions';
import { Job } from '#views/Jobs/types';
import {
  setActivityFilters,
  clearActivityFilters,
} from '#store/activity-filters/action';

type initialState = {
  dateRange: DateRange<Moment>;
  appliedFilters: Record<string, boolean>;
  startTime: Moment | null;
  endTime: Moment | null;
};

const currentDate = moment().startOf('day');
const initialState: initialState = {
  dateRange: [
    moment().startOf('day').subtract(7, 'days'),
    moment().endOf('day'),
  ],
  appliedFilters: {},
  startTime: currentDate,
  endTime: moment().endOf('day'),
};

const ActivityView: FC<{ jobId: Job['id'] }> = ({ jobId }) => {
  const { isIdle } = useTypedSelector((state) => state.auth);
  const { logs, loading, pageable }: JobActivityState = useTypedSelector(
    (state) => state.composer.activity,
  );

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);

  const resetFilter = () => {
    setstate(initialState);
    dispatch(clearActivityFilters());
  };

  const filterProp: FilterProp = {
    filters: [
      {
        label: 'Date/Time Range',
        onApply: () => {
          applyDateTimeFilter();
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
    if (!isIdle && Object.keys(state.appliedFilters).length === 0) fetchData(0);
  }, [state.appliedFilters, isIdle]);

  const fetchLogs = (
    greaterThan: number,
    lowerThan: number,
    page = 0,
    size = 250000,
  ) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'triggeredAt',
          op: 'GOE',
          values: [greaterThan],
        },
        {
          field: 'triggeredAt',
          op: 'LOE',
          values: [lowerThan],
        },
      ],
    });
    dispatch(
      fetchJobActivities({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  const fetchData = (page: number, size?: number) => {
    let lowerThan, greaterThan;
    if (Object.keys(state.appliedFilters).length > 0) {
      return false;
    }
    if (page === 0) {
      lowerThan = moment().endOf('day');
      greaterThan = moment().startOf('day').subtract(7, 'days');
    } else {
      lowerThan = moment()
        .startOf('day')
        .subtract(4 + page * 3, 'days');
      greaterThan = moment()
        .startOf('day')
        .subtract(7 + page * 3, 'days');
    }
    fetchLogs(greaterThan.unix(), lowerThan.unix(), page);
  };

  if (!logs || logs.length === 0 || !pageable) {
    return <div>{loading && 'Loading...'}</div>;
  }

  const grouped = groupBy(logs, 'triggeredOn');
  const data = [] as Record<string, string | JobActivity[]>[];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

  const applyDateTimeFilter = () => {
    const { dateRange, startTime, endTime } = state;
    if (dateRange[0] && dateRange[1] && startTime && endTime) {
      dispatch(
        setActivityFilters({
          type: 'date',
          filter: {
            dateRange: [dateRange[0].unix(), dateRange[1].unix()],
            startTime: startTime.unix(),
            endTime: endTime.unix(),
          },
        }),
      );
      const startTimeParsed = startTime;
      const endTimeParsed = endTime;
      const greaterThan = moment(
        `${dateRange[0].format('YYYY-MM-DD')} ${startTimeParsed.format(
          'HH:mm',
        )}`,
      );
      const lowerThan = moment(
        `${dateRange[1].format('YYYY-MM-DD')} ${endTimeParsed.format('HH:mm')}`,
      );
      fetchLogs(greaterThan.unix(), lowerThan.unix(), 0);
    }
  };

  return (
    <Composer>
      <ListViewComponent
        isSearchable={false}
        callOnScroll={false}
        properties={[]}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={data}
        onPrimaryClick={() =>
          window.open(`/job-activity/print/${jobId}`, '_blank')
        }
        primaryButtonText="Export"
        filterProp={filterProp}
        beforeColumns={[
          {
            header: 'TIME',
            template: function renderComp(item) {
              const day = moment(Object.keys(item)[0]).format('MMM Do, YYYY');
              let criticalCount = 0;
              item[item.id].forEach((element: JobActivity) => {
                if (element.severity === JobActivitySeverity.CRITICAL)
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
                      {item[item.id].map((log: JobActivity) => (
                        <div className="log-item" key={`${log.id}`}>
                          <div className="circle" />
                          <div className="content">
                            <div className="content-items">
                              {moment.unix(log.triggeredAt).format('hh:mm A')}
                            </div>
                            {log.severity === JobActivitySeverity.CRITICAL && (
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

export default ActivityView;
