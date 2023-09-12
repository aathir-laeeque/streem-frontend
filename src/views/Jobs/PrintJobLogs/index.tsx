import { LogType, MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiGetChecklist, apiGetParameters, baseUrl } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDateByInputType, formatDateTime } from '#utils/timeUtils';
import { fetchProcessLogs } from '#views/Checklists/ListView/actions';
import { Document, PDFViewer, Page, View } from '@react-pdf/renderer';
import { camelCase, startCase } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingDiv } from '../PrintJob/styles';
import Footer from '../SummaryPdf/Footer';
import Header from '../SummaryPdf/Header';
import TableRow from '../SummaryPdf/TableRow';
import { FirstPage } from './FirstPage';
import { styles } from './styles';
import { logsResourceChoicesMapper } from '#views/Checklists/JobLogs/DynamicContent';

const COLUMNS_PER_PAGE = 8;
const FREEZED_COLUMNS = 3;
const ROWS_PER_PAGE = 16;
const WIDTH_PER_COLUMN = 100 / 8;

const MyPrintJobAuditLogs: FC<{ viewId: string }> = () => {
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
                value: formatDateByInputType(InputTypes.DATE_TIME, field.values[0]),
              };
              break;
            }
            case 'startedAt': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job Started At',
                value: formatDateByInputType(InputTypes.DATE_TIME, field.values[0]),
              };
              break;
            }
            case 'endedAt': {
              fieldsVisualMap[field.field] = {
                ...fieldsVisualMap[field.field],
                label: 'Job Ended At',
                value: formatDateByInputType(InputTypes.DATE_TIME, field.values[0]),
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
    fetchParameters(_parsedFilters?.fields || []);
    fetchProcess(_parsedFilters?.fields || []);
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

  const renderCell = (row: any, column: any) => {
    if (row[column.id + column.triggerType]) {
      if (column.triggerType === 'RESOURCE') {
        const rowValue = row[column.id + column.triggerType];
        const cellValue = Object.values(rowValue.resourceParameters).reduce<any[]>(
          (acc, p: any) => {
            acc.push(
              `${p.displayName}: ${p.choices
                .map((c: any) => `${c.objectDisplayName} (ID: ${c.objectExternalId})`)
                .join(',')}`,
            );
            return acc;
          },
          [],
        );
        return cellValue.join(',');
      }
      if (column.type === LogType.DATE) {
        return formatDateTime(row[column.id + column.triggerType].value);
      } else if (
        column.type === LogType.FILE &&
        row[column.id + column.triggerType]?.medias?.length
      ) {
        return row[column.id + column.triggerType].medias.map((media: any) => media.name).join(',');
      }
      if (column.triggerType === 'JOB_STATE') {
        return startCase(camelCase(row[column.id + column.triggerType].value));
      }
      return row[column.id + column.triggerType].value;
    }
    return '-';
  };

  const renderTableRow = (columnByPageIndex: number, rowByPageIndex: number) => {
    const columnsForRow = [
      ...visibleColumns.slice(0, FREEZED_COLUMNS),
      ...visibleColumns.slice(
        FREEZED_COLUMNS + columnByPageIndex * COLUMNS_TO_ADD_PER_PAGE,
        FREEZED_COLUMNS + columnByPageIndex * COLUMNS_TO_ADD_PER_PAGE + COLUMNS_TO_ADD_PER_PAGE,
      ),
    ];

    return (
      <View style={styles.table}>
        <TableRow
          columns={columnsForRow.map((column, i) => ({
            text: column.displayName,
            customStyle: {
              textAlign: 'left',
              width: `${WIDTH_PER_COLUMN}%`,
              height: 70,
              paddingVertical: 5,
              backgroundColor: i < FREEZED_COLUMNS ? '#dadada' : '#F5F5F5',
            },
          }))}
          customStyle={{ fontFamily: 'NunitoBold' }}
          key={`columns${columnByPageIndex}`}
        />
        {[
          ...parsedJobLogs.slice(
            rowByPageIndex * ROWS_PER_PAGE,
            rowByPageIndex * ROWS_PER_PAGE + ROWS_PER_PAGE,
          ),
        ].map((row, ri) => (
          <TableRow
            columns={columnsForRow.map((column) => ({
              text: renderCell(row, column),
              customStyle: {
                textAlign: 'left',
                width: `${WIDTH_PER_COLUMN}%`,
                borderColor: '#F5F5F5',
                borderWidth: 1,
                height: 25,
                paddingVertical: 5,
              },
            }))}
            customStyle={{ backgroundColor: '#fff' }}
            key={`rows${rowByPageIndex}${ri}`}
          />
        ))}
      </View>
    );
  };

  if (!profile || loading || loadingFilters || loadingProcess) return null;

  const logsParser = (log: any, jobId: string) => {
    switch (log.triggerType) {
      case 'RESOURCE_PARAMETER':
        const selectedChoices = (
          resourceParameterChoicesMap.current?.[jobId]?.[log.entityId]?.choices || []
        ).reduce<any[]>((acc: any[], c: any) => {
          acc.push(`${c?.objectDisplayName} (ID: ${c?.objectExternalId})`);
          return acc;
        }, []);

        return {
          ...log,
          value: selectedChoices?.join(', '),
        };
      default:
        return log;
    }
  };

  const parsedJobLogs = list.reduce((acc, jobLog, index) => {
    jobLog.logs.forEach((log: any) => {
      acc[index] = {
        ...acc[index],
        [log.entityId + log.triggerType]: logsParser(log, jobLog.id),
      };
    });
    return acc;
  }, []);

  const COLUMNS_TO_ADD_PER_PAGE = COLUMNS_PER_PAGE - FREEZED_COLUMNS;
  const pagesByColumns = Array.from(
    {
      length: Math.ceil((visibleColumns.length - COLUMNS_PER_PAGE) / COLUMNS_TO_ADD_PER_PAGE) + 1,
    },
    (_, i) => i,
  );

  const pagesByRows = Array.from(
    {
      length: Math.ceil(parsedJobLogs.length / ROWS_PER_PAGE),
    },
    (_, i) => i,
  );

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page} orientation="landscape">
          <Header logoUrl={settings?.logoUrl ?? ''} />
          <FirstPage
            filters={filtersVisualMap}
            log={list?.[0]}
            showProcessSection={showProcessSection}
            checklist={process}
          />
          <Footer
            user={profile}
            selectedFacility={selectedFacility!}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
        </Page>

        {pagesByRows.map((_, rowsPagesIndex) => (
          <>
            {pagesByColumns.map((_, i) => (
              <Page style={styles.page} orientation="landscape">
                <Header logoUrl={settings?.logoUrl ?? ''} />
                <View style={styles.container}>{renderTableRow(i, rowsPagesIndex)}</View>
                <Footer
                  user={profile}
                  selectedFacility={selectedFacility!}
                  dateAndTimeStampFormat={dateAndTimeStampFormat}
                />
              </Page>
            ))}
          </>
        ))}
      </Document>
    </PDFViewer>
  );
};

const MemoPrintJobAuditLogs = React.memo(MyPrintJobAuditLogs);

const PrintJobAuditLogs: FC<any> = ({ viewId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {viewId && <MemoPrintJobAuditLogs viewId={viewId} />}
  </>
);

export default PrintJobAuditLogs;
