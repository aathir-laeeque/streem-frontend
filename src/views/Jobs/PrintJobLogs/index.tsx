import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiGetChecklist, apiGetParameters, baseUrl } from '#utils/apiUrls';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { logsResourceChoicesMapper } from '#views/Checklists/JobLogs/DynamicContent';
import { fetchProcessLogs } from '#views/Checklists/ListView/actions';
import { camelCase, startCase } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import usePdfWorkerHook from '../PdfWorker/usePdfWorkerHook';
import { LoadingDiv } from '../PrintJob/styles';

const Download: FC<any> = ({ viewId }) => {
  const {
    checklistListView: {
      jobLogs: { list, loading },
    },
    auth: { profile, settings, selectedFacility },
    auditLogFilters: { filters, columns: visibleColumns },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const [state, setState] = useState<{
    loadingFilters: boolean;
    parsedFilters?: Record<string, any>;
    loadingParameters: boolean;
    parameterList: any[];
    filtersVisualMap: Record<string, any>;
    showProcessSection: boolean;
    loadingProcess: boolean;
    process?: any;
  }>({
    loadingFilters: true,
    loadingParameters: true,
    parameterList: [],
    filtersVisualMap: {},
    showProcessSection: false,
    loadingProcess: true,
  });
  const {
    loadingFilters,
    parsedFilters,
    parameterList,
    loadingParameters,
    filtersVisualMap,
    showProcessSection,
    loadingProcess,
    process,
  } = state;
  const resourceParameterChoicesMap = useRef(logsResourceChoicesMapper(list));
  const dispatch = useDispatch();

  const fetchParameters = async (fields: { field: string; op: string; values: string[] }[]) => {
    const checklistId = fields.find((field) => field.field === 'checklistId')?.values?.[0];
    if (checklistId) {
      const parameters = await request(
        'GET',
        apiGetParameters(
          checklistId,
          [MandatoryParameter.RESOURCE, MandatoryParameter.SINGLE_SELECT].toString(),
        ),
      );
      setState((prev) => ({
        ...prev,
        parameterList: parameters.data,
        loadingParameters: false,
        showProcessSection: true,
      }));
    } else {
      setState((prev) => ({ ...prev, loadingParameters: false }));
    }
  };

  const fetchProcess = async (fields: { field: string; op: string; values: string[] }[]) => {
    const checklistId = fields.find((field) => field.field === 'checklistId')?.values?.[0];
    if (checklistId) {
      const process = await request('GET', apiGetChecklist(checklistId));
      setState((prev) => ({
        ...prev,
        process: process.data,
        loadingProcess: false,
        showProcessSection: true,
      }));
    } else {
      setState((prev) => ({ ...prev, loadingProcess: false }));
    }
  };

  const fetchFiltersData = async (fields: { field: string; op: string; values: string[] }[]) => {
    const fieldsVisualMap: Record<string, any> = {};
    let fieldsToUpdate: string[] = [];
    let promises: any[] = [];
    fields.forEach((field) => {
      if (
        !['checklistId', 'facilityId', 'logs.triggerType', 'logs.identifierValue'].includes(
          field.field,
        )
      ) {
        fieldsVisualMap[field.field] = {
          label: field.field,
          value: field.values[0],
          op: field.op,
        };
        const fieldId = field.field.split('.');
        if (fieldId[0] === 'parameterValues') {
          const parameterId = fieldId[1];
          const parameter = parameterList.find((p) => p.id === parameterId);
          fieldsVisualMap[field.field] = {
            ...fieldsVisualMap[field.field],
            label: parameter.label,
          };
          if (parameter.type === MandatoryParameter.SINGLE_SELECT) {
            const fieldValue = parameter.data.find((d: any) => d.id === field.values[0]).name;
            fieldsVisualMap[field.field] = {
              ...fieldsVisualMap[field.field],
              value: fieldValue,
            };
          } else {
            fieldsToUpdate.push(field.field);
            promises.push(request('GET', `${baseUrl}${parameter.data.urlPath}&page=0&size=250`));
          }
        } else {
          switch (field.field) {
            case 'createdAt': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job Created At',
                value: formatDateTime({ value: field.values[0] }),
              };
              break;
            }
            case 'startedAt': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job Started At',
                value: formatDateTime({ value: field.values[0] }),
              };
              break;
            }
            case 'endedAt': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job Ended At',
                value: formatDateTime({ value: field.values[0] }),
              };
              break;
            }
            case 'state': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job State',
                value: startCase(camelCase(field.values[0])),
              };
              break;
            }
            default:
              break;
          }
        }
      }
    });
    const results = await Promise.all(promises);
    fieldsToUpdate.forEach((fieldId, index: number) => {
      const currentValue = fieldsVisualMap[fieldId].value;
      const response = results[index].data;
      fieldsVisualMap[fieldId] = {
        ...fieldsVisualMap[fieldId],
        value: response.find((object: any) => object.id === currentValue).displayName,
      };
    });
    setState((prev) => ({ ...prev, loadingFilters: false, filtersVisualMap: fieldsVisualMap }));
  };

  useEffect(() => {
    const _parsedFilters = JSON.parse(filters);
    setState((prev) => ({ ...prev, parsedFilters: _parsedFilters }));
    dispatch(
      fetchProcessLogs({
        page: 0,
        size: 250,
        filters: _parsedFilters,
        sort: 'id,desc',
      }),
    );
    fetchParameters(_parsedFilters?.fields || []);
    fetchProcess(_parsedFilters?.fields || []);
    setKeepPersistedData();
  }, [filters]);

  useEffect(() => {
    if (!loadingParameters) {
      fetchFiltersData(parsedFilters?.fields || []);
    }
  }, [loadingParameters]);

  useEffect(() => {
    if (list.length) {
      resourceParameterChoicesMap.current = logsResourceChoicesMapper(list);
    }
  }, [list]);

  useEffect(() => {
    if (parsedFilters) {
      setKeepPersistedData();
      dispatch(
        fetchProcessLogs({
          page: 0,
          size: 250,
          filters: parsedFilters,
          sort: 'id,desc',
        }),
      );
    }
  }, [parsedFilters]);

  const workerProps = {
    visibleColumns,
    viewId,
    profile,
    settings,
    filtersVisualMap,
    list,
    showProcessSection,
    selectedFacility,
    dateAndTimeStampFormat,
    resourceParameterChoicesMap,
    process,
    type: 'CUSTOM_VIEW_JOB_LOGS',
  };

  usePdfWorkerHook({
    keysToCheck: [
      'visibleColumns',
      'viewId',
      'profile',
      'settings',
      'filtersVisualMap',
      'list',
      'showProcessSection',
      'selectedFacility',
      'dateAndTimeStampFormat',
      'resourceParameterChoicesMap',
      'process',
    ],
    loadingKeysToCheck: { loading, loadingFilters, loadingProcess },
    ...workerProps,
  });

  return <LoadingDiv>Loading...</LoadingDiv>;
};

export default Download;
