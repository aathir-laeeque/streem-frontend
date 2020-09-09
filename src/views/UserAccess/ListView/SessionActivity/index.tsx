import React, { FC, useEffect } from 'react';
import { ListViewComponent } from '#components';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import {
  SessionActivity as SessionActivityType,
  SessionActivityState,
  SessionActivitySeverity,
} from './types';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useTypedSelector } from '#store';
import { navigate as navigateTo } from '@reach/router';
import { fetchSessionActivitys } from './actions';
import { useDispatch } from 'react-redux';
import { Composer } from './styles';
import { TabViewProps } from '../types';

const SessionActivity: FC<TabViewProps> = ({ navigate = navigateTo }) => {
  const {
    logs,
    loading,
    pageable,
  }: Partial<SessionActivityState> = useTypedSelector(
    (state) => state.sessionActivity,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // const filters = JSON.stringify({
    //   op: 'AND',
    //   fields: [
    //     {
    //       field: 'triggeredAt',
    //       op: 'GOE',
    //       values: ['2020-09-01'],
    //     },
    //     {
    //       field: 'triggeredAt',
    //       op: 'LOE',
    //       values: ['2020-09-10'],
    //     },
    //   ],
    // });
    dispatch(fetchSessionActivitys({ sort: 'triggeredAt,desc' }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!logs || !pageable) {
    return <div />;
  }

  const grouped = groupBy(logs, 'triggeredOn');
  const data = [];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

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
                      {criticalCount && (
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
