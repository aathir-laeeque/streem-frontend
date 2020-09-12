import React, { FC, useEffect, useState } from 'react';
import { ListViewComponent, Button, FlatButton } from '#components';
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
import MenuItem from '@material-ui/core/MenuItem';
import {
  StaticDateRangePicker,
  DateRangeDelimiter,
  DateRange,
  LocalizationProvider,
  TimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import NestedMenuItem from '#components/shared/NestedMenuItem';

// TODO ADD ONRESET TO LISTVIEW COMPONENT AND REMOVE COMMENTED SECTION IF REQUIRED.

const SessionActivity: FC<TabViewProps> = ({ navigate = navigateTo }) => {
  const {
    logs,
    loading,
    pageable,
  }: Partial<SessionActivityState> = useTypedSelector(
    (state) => state.sessionActivity,
  );

  const dispatch = useDispatch();

  const currentDate = moment().startOf('day');
  const [value, setValue] = useState<DateRange<Moment>>([null, null]);
  const [timeOneValue, setTimeOneValue] = useState<Moment | null>(currentDate);
  const [timeTwoValue, setTimeTwoValue] = useState<Moment | null>(currentDate);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchData(0);
  }, []);

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
    let lowerThan;
    let greaterThan;
    if (value[0]) {
      return false;
    }
    if (page === 0) {
      lowerThan = moment.utc().endOf('day');
      greaterThan = moment.utc().startOf('day').subtract(7, 'days');
      // lowerThan = moment.utc('2020-09-13 00:00');
      // greaterThan = moment.utc('2020-09-12 00:00');
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

    console.log('lowerThan', lowerThan.inspect());
    console.log('greaterThan', greaterThan.inspect());
    fetchLogs(greaterThan.unix(), lowerThan.unix(), page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!logs || !pageable) {
    return <div />;
  }

  const grouped = groupBy(logs, 'triggeredOn');
  const data = [] as Record<string, string | SessionActivityType[]>[];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const applyFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value[0] && value[1] && timeOneValue && timeTwoValue) {
      const startTime =
        typeof timeOneValue === 'number' ? moment(timeOneValue) : timeOneValue;
      const endTime =
        typeof timeTwoValue === 'number' ? moment(timeTwoValue) : timeTwoValue;
      const greaterThan = moment.utc(
        `${value[0].format('YYYY-MM-DD')} ${startTime.format('HH:mm')}`,
      );
      const lowerThan = moment.utc(
        `${value[1].format('YYYY-MM-DD')} ${endTime.format('HH:mm')}`,
      );

      handleClose();
      fetchLogs(greaterThan.unix(), lowerThan.unix(), 0);
    }
  };

  // const resetFilter = () => {
  //   setValue([null, null]);
  //   setTimeOneValue(currentDate);
  //   setTimeTwoValue(currentDate);
  // };

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
        filterOnClick={handleClick}
        filterComponent={
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: 40 }}
          >
            <MenuItem
              onClick={() => {
                console.log('clicked');
              }}
            >
              Type
            </MenuItem>
            <NestedMenuItem
              right
              disabled={true}
              label="Date/Time Range"
              mainMenuOpen={anchorEl ? true : false}
              // MenuItemProps={{
              //   onMouseLeave: () => {
              //     console.log('Left');
              //   },
              // }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="filter-container"
              >
                <LocalizationProvider dateAdapter={MomentUtils}>
                  <StaticDateRangePicker
                    displayStaticWrapperAs="desktop"
                    value={value}
                    calendars={1}
                    onChange={(newValue) => setValue(newValue)}
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
                      value={timeOneValue}
                      InputProps={{
                        startAdornment: (
                          <AccessTimeIcon
                            style={{
                              paddingLeft: '4px',
                              paddingRight: '4px',
                              color: '#999999',
                            }}
                          />
                        ),
                      }}
                      openPickerIcon={<ArrowDropDownIcon />}
                      onChange={(newValue) => setTimeOneValue(newValue)}
                    />
                    <TimePicker
                      renderInput={(props) => <TextField {...props} />}
                      ampm={false}
                      label="End Time"
                      value={timeTwoValue}
                      InputProps={{
                        startAdornment: (
                          <AccessTimeIcon
                            style={{
                              paddingLeft: '4px',
                              paddingRight: '4px',
                              color: '#999999',
                            }}
                          />
                        ),
                      }}
                      openPickerIcon={<ArrowDropDownIcon />}
                      onChange={(newValue) => setTimeTwoValue(newValue)}
                    />
                  </div>
                  <div className="picker-actions">
                    {/* <FlatButton
                      style={{ border: 'none' }}
                      onClick={resetFilter}
                    >
                      Reset
                    </FlatButton> */}
                    <Button
                      style={{ marginRight: 0 }}
                      onClick={(e) => applyFilter(e)}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </LocalizationProvider>
              </div>
            </NestedMenuItem>
            <MenuItem
              onClick={() => {
                console.log('clicked');
              }}
            >
              Users
            </MenuItem>
          </Menu>
        }
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
