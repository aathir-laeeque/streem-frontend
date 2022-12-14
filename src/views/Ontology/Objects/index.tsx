import { DataTable, TabContentProps } from '#components';
import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { apiGetJobLogs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { navigate, RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObject, fetchObjectType, resetOntology } from '../actions';
import { LoadingContainer } from '../ObjectTypes/ObjectTypeList';
import ObjectView from './ObjectView';

type RelationLogsState = {
  rows: any[];
  columns: any[];
  loading: boolean;
  checklistId?: string;
};

const JobLogsTabContent: FC<TabContentProps> = ({ label, values: { objectTypeId, id } }) => {
  const {
    objects: { active },
  } = useTypedSelector((state) => state.ontology);
  const [{ rows, columns, checklistId, loading }, setState] = useState<RelationLogsState>({
    rows: [],
    columns: [
      {
        id: 'CHK_NAME',
        label: 'Checklist Name',
        minWidth: 100,
      },
      {
        id: 'CHK_ID',
        label: 'Checklist Id',
        minWidth: 100,
        format: function renderComp(row: any) {
          const checklistExternalId = row['CHK_ID'];
          return (
            <span
              className="primary"
              onClick={() => {
                navigate(`/checklists/${row.checklistId}`);
              }}
              title={checklistExternalId}
            >
              {checklistExternalId}
            </span>
          );
        },
      },
      {
        id: 'JOB_ID',
        label: 'Job Id',
        minWidth: 100,
        format: function renderComp(row: any) {
          const jobExternalId = row['JOB_ID'];
          return (
            <span
              className="primary"
              onClick={() => {
                navigate(`/jobs/${row.jobId}`);
              }}
              title={jobExternalId}
            >
              {jobExternalId}
            </span>
          );
        },
      },
      {
        id: 'JOB_START_TIME',
        label: 'Job Started At',
        minWidth: 100,
        format: (row: any) => {
          if (row['JOB_START_TIME']) {
            return formatDateTime(row['JOB_START_TIME']);
          }
          return '-';
        },
      },
      {
        id: 'JOB_END_TIME',
        label: 'Job Ended At',
        minWidth: 100,
        format: (row: any) => {
          if (row['JOB_END_TIME']) {
            return formatDateTime(row['JOB_END_TIME']);
          }
          return '-';
        },
      },
    ],
    loading: true,
  });

  useEffect(() => {
    if (active?.externalId) {
      (async () => {
        try {
          const logsData: ResponseObj<any> = await request('GET', apiGetJobLogs(), {
            params: {
              triggerType: 'RESOURCE_PARAMETER',
              value: active.externalId,
            },
          });
          const data = logsData.data.reduce((acc: any, jobLog: any, index: number) => {
            jobLog.logs.forEach((log: any) => {
              acc[index] = {
                ...acc[index],
                [log.triggerType]: log.value,
              };
            });
            acc[index]['jobId'] = jobLog.jobId;
            acc[index]['checklistId'] = jobLog.checklistId;
            return acc;
          }, []);
          setState((prev) => ({ ...prev, rows: data, loading: false }));
        } catch (error) {
          console.error('error on fetching job logs for relation :: ', error);
        }
      })();
    }
  }, [active]);

  return <DataTable columns={columns} rows={rows} />;
};

const ObjectsContent = ({
  id,
  objectTypeId,
}: RouteComponentProps<{ id: string; objectTypeId: string }>) => {
  const dispatch = useDispatch();
  const {
    objects: { active: selectedObject, activeLoading: loadingObject },
    objectTypes: { active: selectedObjectType },
  } = useTypedSelector((state) => state.ontology);
  const isAddingNew = id === 'new';

  useEffect(() => {
    if (objectTypeId && !selectedObjectType) {
      dispatch(fetchObjectType(objectTypeId));
    }

    return () => {
      dispatch(resetOntology(['objects', 'activeLoading']));
    };
  }, []);

  useEffect(() => {
    if (selectedObjectType && selectedObjectType.externalId && id && !isAddingNew) {
      dispatch(fetchObject(id, { collection: selectedObjectType.externalId }));
    }
  }, [selectedObjectType]);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: 'Detail',
        tabContent: ObjectView,
        values: { id, objectTypeId },
      },
      {
        label: 'Usage Logs',
        tabContent: JobLogsTabContent,
        values: { id, objectTypeId },
      },
    ],
  });

  return (
    <LoadingContainer
      loading={isAddingNew ? false : loadingObject}
      component={
        <ViewWrapper>
          <div className="header">
            <div className="heading">
              {isAddingNew
                ? `Adding a new ${selectedObjectType?.displayName}`
                : `${selectedObjectType?.displayName} - ${selectedObject?.displayName}`}
            </div>
          </div>

          <div className="list-table">
            {renderTabHeader()}
            {renderTabContent()}
          </div>
        </ViewWrapper>
      }
    />
  );
};

export default ObjectsContent;
