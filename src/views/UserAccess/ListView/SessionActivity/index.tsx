import React, { FC, useEffect, useState } from 'react';
import { ListViewComponent, FilterProp } from '#components';
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
import { fetchSessionActivitys } from './actions';
import { useDispatch } from 'react-redux';
import { Composer } from './styles';
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

// TODO ADD ONRESET TO LISTVIEW COMPONENT AND REMOVE COMMENTED SECTION IF REQUIRED.

type initialState = {
  dateRange: DateRange<Moment>;
  filterCount: number;
  startTime: Moment | null;
  endTime: Moment | null;
};

const currentDate = moment().startOf('day');
const initialState: initialState = {
  dateRange: [null, null],
  filterCount: 0,
  startTime: currentDate,
  endTime: currentDate,
};

const SessionActivity: FC<TabViewProps> = ({ navigate = navigateTo }) => {
  const {
    logs,
    loading,
    pageable,
  }: Partial<SessionActivityState> = useTypedSelector(
    (state) => state.sessionActivity,
  );

  const dispatch = useDispatch();
  const [state, setstate] = useState(initialState);

  const resetFilter = () => {
    setstate(initialState);
  };

  const filterProp: FilterProp = {
    filters: [
      {
        label: 'Type',
        onApply: () => console.log('Applied'),
        content: <div />,
      },
      {
        label: 'Date/Time Range',
        onApply: () => {
          applyDateTimeFilter();
          setstate({ ...state, filterCount: state.filterCount + 1 });
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
        onApply: () => console.log('Applied'),
        content: <div />,
      },
    ],
    onReset: () => resetFilter(),
    activeCount: state.filterCount,
  };

  useEffect(() => {
    if (state.filterCount === 0) fetchData(0);
  }, [state.filterCount]);

  const fetchLogs = (greaterThan: number, lowerThan: number, page: number) => {
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
      fetchSessionActivitys({ filters, sort: 'triggeredAt,desc', page }),
    );
  };

  const fetchData = (page: number, size?: number) => {
    let lowerThan, greaterThan;
    if (state.filterCount > 0) {
      return false;
    }
    if (page === 0) {
      lowerThan = moment.utc().endOf('day');
      greaterThan = moment.utc().startOf('day').subtract(7, 'days');
    } else {
      lowerThan = moment
        .utc()
        .startOf('day')
        .subtract(4 + page * 3, 'days');
      greaterThan = moment
        .utc()
        .startOf('day')
        .subtract(7 + page * 3, 'days');
    }
    fetchLogs(greaterThan.unix(), lowerThan.unix(), page);
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

  const applyDateTimeFilter = () => {
    const { dateRange, startTime, endTime } = state;
    if (dateRange[0] && dateRange[1] && startTime && endTime) {
      const startTimeParsed =
        typeof startTime === 'number' ? moment(startTime) : startTime;
      const endTimeParsed =
        typeof endTime === 'number' ? moment(endTime) : endTime;
      const greaterThan = moment.utc(
        `${dateRange[0].format('YYYY-MM-DD')} ${startTimeParsed.format(
          'HH:mm',
        )}`,
      );
      const lowerThan = moment.utc(
        `${dateRange[1].format('YYYY-MM-DD')} ${endTimeParsed.format('HH:mm')}`,
      );
      fetchLogs(greaterThan.unix(), lowerThan.unix(), 0);
    }
  };

  return (
    <Composer>
      <ListViewComponent
        properties={[]}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={data}
        onPrimaryClick={() => console.log('Primary Clicked')}
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
                              {moment(log.triggeredAt).format('hh:mm A')}
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
