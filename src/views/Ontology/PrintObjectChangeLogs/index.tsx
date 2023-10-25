import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import TableRow from '#views/Jobs/SummaryPdf/TableRow';
import { Document, Page, PDFViewer, View } from '@react-pdf/renderer';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingDiv } from '../../Jobs/PrintJob/styles';
import Footer from '../../Jobs/SummaryPdf/Footer';
import Header from '../../Jobs/SummaryPdf/Header';
import { fetchObjectChangeLogs } from '../actions';
import { FirstPage } from './FirstPage';
import { styles } from './styles';

const ROWS_PER_PAGE = 12;

const MyPrintObjectChangeLogs: FC<{ objectId: string }> = () => {
  const {
    auth: { profile, settings, selectedFacility },
    ontology: {
      objectChangeLogs: { list, listLoading },
    },
    auditLogFilters: { filters, pdfMetaData },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );
  const dispatch = useDispatch();
  const [state, setState] = useState<{
    loadingFilters: boolean;
    parsedFilters?: Record<string, any>;
    filtersVisualMap: Record<string, any>;
  }>({
    loadingFilters: true,
    filtersVisualMap: {},
  });
  const { loadingFilters, parsedFilters, filtersVisualMap } = state;

  const fetchFiltersData = (fields: { key: string; constraint: string; value: any }[]) => {
    const fieldsVisualMap: Record<string, any> = {};
    fields.forEach((field) => {
      switch (field.key) {
        case 'modifiedAt':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done At',
            value: formatDateTime({ value: field?.value }),
            op: field.constraint,
          };
          break;
        case 'modifiedBy.id':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done By',
            value: field?.value?.label,
            op: field.constraint,
          };
          break;
        case 'entityId':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done To',
            value: field?.value?.label,
            op: field.constraint,
          };
          break;
      }
    });
    return fieldsVisualMap;
  };

  const getLogValues = (log: Record<string, any>) => {
    let contentString;

    if (log.new) {
      log?.new?.forEach((currData: Record<string, any>) => {
        contentString = dataParser(log?.entityInputType, currData);
      });
    } else {
      log.usageStatus.new === 1 ? (contentString = 'Active') : (contentString = 'Archived');
    }
    return contentString;
  };

  const dataParser = (type: string, data: Record<string, any>) => {
    switch (type) {
      case InputTypes.DATE_TIME:
      case InputTypes.DATE:
        return formatDateTime({ value: data?.input, type });
      default:
        return data?.input;
    }
  };

  const filterParser = (filter: Record<string, any>) => {
    const newfields = filter.fields.reduce((acc, currFilter) => {
      if (currFilter.field) {
        acc.push(currFilter);
      } else {
        acc.push({
          field: currFilter.key,
          op: currFilter.constraint,
          values: currFilter.value.label ? [currFilter.value.value] : [currFilter.value],
        });
      }
      return acc;
    }, []);
    return { ...filter, fields: newfields };
  };

  const pagesByRows = Array.from(
    {
      length: Math.ceil(list.length / ROWS_PER_PAGE),
    },
    (_, i) => i,
  );

  useEffect(() => {
    if (parsedFilters?.fields) {
      setKeepPersistedData();
      dispatch(
        fetchObjectChangeLogs({
          page: 0,
          size: 250,
          filters: parsedFilters,
        }),
      );
    }
  }, [parsedFilters]);

  useEffect(() => {
    const _parsedFilters = filterParser(JSON.parse(filters));
    const _filtersVisualMap = fetchFiltersData(JSON.parse(filters).fields);
    setState((prev) => ({
      ...prev,
      parsedFilters: _parsedFilters,
      filtersVisualMap: _filtersVisualMap,
      loadingFilters: false,
    }));
  }, [filters]);

  if (!profile || listLoading || loadingFilters) return null;

  const renderTableRow = (rowByPageIndex: number) => {
    return (
      <View style={styles.table}>
        <TableRow
          fixed
          columns={[
            {
              text: 'Change Done To',
              customStyle: {
                textAlign: 'left',
                width: '20%',
                paddingVertical: 15,
              },
            },
            {
              text: 'Changed To',
              customStyle: {
                textAlign: 'left',
                width: '20%',
                paddingVertical: 15,
              },
            },
            {
              text: 'Change Done At',
              customStyle: {
                textAlign: 'left',
                width: '20%',
                paddingVertical: 15,
              },
            },
            {
              text: 'Change Done By',
              customStyle: {
                textAlign: 'left',
                width: '20%',
                paddingVertical: 15,
              },
            },
            {
              text: 'Reason',
              customStyle: {
                textAlign: 'left',
                width: '20%',
                paddingVertical: 15,
              },
            },
          ]}
          customStyle={{
            height: 35,
            paddingVertical: 5,
            backgroundColor: '#dadada',
          }}
        />
        {list
          .slice(rowByPageIndex * ROWS_PER_PAGE, rowByPageIndex * ROWS_PER_PAGE + ROWS_PER_PAGE)
          .map((currLog) => (
            <TableRow
              fixed
              columns={[
                {
                  text: currLog?.entityDisplayName ? currLog.entityDisplayName : 'Usage Status',
                  customStyle: {
                    textAlign: 'left',
                    width: '20%',
                    paddingVertical: 15,
                  },
                },
                {
                  text: getLogValues(currLog),
                  customStyle: {
                    textAlign: 'left',
                    width: '20%',
                    paddingVertical: 15,
                  },
                },
                {
                  text: currLog?.modifiedAt
                    ? formatDateTime({ value: currLog?.modifiedAt })
                    : 'N/A',
                  customStyle: {
                    textAlign: 'left',
                    width: '20%',
                    paddingVertical: 15,
                  },
                },
                {
                  text: `${currLog?.modifiedBy?.firstName} ${currLog?.modifiedBy?.lastName} (ID: ${currLog?.modifiedBy?.employeeId})`,
                  customStyle: {
                    textAlign: 'left',
                    width: '20%',
                    paddingVertical: 15,
                  },
                },
                {
                  text: currLog?.reason
                    ? currLog?.info
                      ? `${currLog?.reason} ${currLog?.info?.processName} (ID: ${currLog?.info?.jobCode})`
                      : currLog?.reason
                    : 'N/A',
                  customStyle: {
                    textAlign: 'left',
                    width: '20%',
                    paddingVertical: 15,
                  },
                },
              ]}
              customStyle={{
                height: 35,
                paddingVertical: 5,
                backgroundColor: '#ffffff',
              }}
            />
          ))}
      </View>
    );
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page} orientation="landscape">
          <Header logoUrl={settings?.logoUrl ?? ''} />
          <FirstPage filters={filtersVisualMap} objectDetails={pdfMetaData} />
          <Footer
            user={profile}
            selectedFacility={selectedFacility!}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
        </Page>
        {pagesByRows.map((_, index) => (
          <Page style={styles.page} orientation="landscape">
            <Header logoUrl={settings?.logoUrl ?? ''} />
            <View style={styles.container}>{renderTableRow(index)}</View>
            <Footer
              user={profile}
              selectedFacility={selectedFacility!}
              dateAndTimeStampFormat={dateAndTimeStampFormat}
            />
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};

const MemoPrintObjectChangeLogs = React.memo(MyPrintObjectChangeLogs);

const PrintObjectChangeLogs: FC<any> = ({ objectId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {objectId && <MemoPrintObjectChangeLogs objectId={objectId} />}
  </>
);

export default PrintObjectChangeLogs;
