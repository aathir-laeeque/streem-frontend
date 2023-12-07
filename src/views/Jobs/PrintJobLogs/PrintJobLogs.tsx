import { LogType, TriggerTypeEnum } from '#PrototypeComposer/checklist.types';
import { PdfFooter, PdfHeader, TableRow, commonPdfStyles } from '#components/documents';
import { logsParser } from '#utils/parameterUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import { camelCase, startCase } from 'lodash';
import React, { FC } from 'react';
import { FirstPage } from './FirstPage';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#dadada',
  },
});

const COLUMNS_PER_PAGE = 10;
const FREEZED_COLUMNS = 1;
const ROWS_PER_PAGE = 12;
const WIDTH_PER_COLUMN = 100 / 10;
const COLUMNS_TO_ADD_PER_PAGE = COLUMNS_PER_PAGE - FREEZED_COLUMNS;

export const MyCustomViewJobAuditLogs: FC<any> = ({
  visibleColumns,
  profile,
  settings,
  filtersVisualMap,
  list,
  showProcessSection,
  selectedFacility,
  dateAndTimeStampFormat,
  process,
  resourceParameterChoicesMap,
  timeFormat,
  dateFormat,
}) => {
  const renderCell = (row: any, column: any) => {
    if (row[column.id + column.triggerType]) {
      if (column.triggerType === TriggerTypeEnum.RESOURCE) {
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
      if (column.type === LogType.DATE_TIME) {
        return formatDateTime({
          value: row[column.id + column.triggerType].value,
          format: dateAndTimeStampFormat,
        });
      } else if (column.type === LogType.DATE) {
        return formatDateTime({
          value: row[column.id + column.triggerType].value,
          format: dateFormat,
        });
      } else if (column.type === LogType.TIME) {
        return formatDateTime({
          value: row[column.id + column.triggerType].value,
          format: timeFormat,
        });
      } else if (
        column.type === LogType.FILE &&
        row[column.id + column.triggerType]?.medias?.length
      ) {
        return row[column.id + column.triggerType].medias.map((media: any) => media.name).join(',');
      }
      if (column.triggerType === TriggerTypeEnum.JOB_STATE) {
        return startCase(camelCase(row[column.id + column.triggerType].value));
      } else if (column.triggerType === TriggerTypeEnum.PARAMETER_SELF_VERIFIED_BY) {
        const selfVerifiedAt = row[column.id + TriggerTypeEnum.PARAMETER_SELF_VERIFIED_AT]?.value;
        if (row[column.id + column.triggerType].value) {
          return `Performed at ${formatDateTime({
            value: selfVerifiedAt,
            format: dateAndTimeStampFormat,
          })}, by ${row[column.id + column.triggerType].value}`;
        } else {
          return '-';
        }
      } else if (column.triggerType === TriggerTypeEnum.PARAMETER_PEER_VERIFIED_BY) {
        const peerVerifiedAt = row[column.id + TriggerTypeEnum.PARAMETER_PEER_VERIFIED_AT]?.value;
        if (row[column.id + column.triggerType].value) {
          return `Performed at ${formatDateTime({
            value: peerVerifiedAt,
            format: dateAndTimeStampFormat,
          })}, by ${row[column.id + column.triggerType].value}`;
        } else {
          return '-';
        }
      }
      return row[column.id + column.triggerType].value || '-';
    }
    return '-';
  };

  const reArrangeColumns = (arr: any[]) => {
    let orderTree = 1;
    const orderedArr = arr.map((item) => {
      if (item.triggerType === 'JOB_ID') {
        orderTree = 1;
      } else {
        orderTree++;
      }
      return { ...item, orderTree };
    });
    return orderedArr?.sort((a, b) => a.orderTree - b.orderTree) || [];
  };

  // Filter out the self and peer verification timestamp columns
  const filteredVisibleColumns = visibleColumns.filter((item: any) => {
    return (
      item.triggerType !== TriggerTypeEnum.PARAMETER_SELF_VERIFIED_AT &&
      item.triggerType !== TriggerTypeEnum.PARAMETER_PEER_VERIFIED_AT
    );
  });

  const renderTableRow = (columnByPageIndex: number, rowByPageIndex: number) => {
    const reArrangedColumns = reArrangeColumns(filteredVisibleColumns);
    const columnsForRow = [
      ...reArrangedColumns.slice(0, FREEZED_COLUMNS),
      ...reArrangedColumns.slice(
        FREEZED_COLUMNS + columnByPageIndex * COLUMNS_TO_ADD_PER_PAGE,
        FREEZED_COLUMNS + columnByPageIndex * COLUMNS_TO_ADD_PER_PAGE + COLUMNS_TO_ADD_PER_PAGE,
      ),
    ];

    return (
      <View>
        <TableRow
          columns={columnsForRow.map((column, i) => ({
            text: column.displayName,
            customStyle: {
              width: `${WIDTH_PER_COLUMN}%`,
              paddingVertical: 6,
              fontWeight: 700,
              backgroundColor: i < FREEZED_COLUMNS ? '#dadada' : '#F5F5F5',
            },
          }))}
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
                width: `${WIDTH_PER_COLUMN}%`,
                borderColor: '#F5F5F5',
              },
            }))}
            customStyle={{ backgroundColor: '#fff' }}
            key={`rows${rowByPageIndex}${ri}`}
          />
        ))}
      </View>
    );
  };

  const parsedJobLogs = list.reduce((acc: any, jobLog: any, index: number) => {
    jobLog.logs.forEach((log: any) => {
      acc[index] = {
        ...acc[index],
        [log.entityId + log.triggerType]: logsParser(
          log,
          jobLog.id,
          resourceParameterChoicesMap.current,
        ),
      };
    });
    return acc;
  }, []);

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
    <Document>
      <Page style={commonPdfStyles.page} orientation="landscape">
        <PdfHeader logoUrl={settings?.logoUrl} />
        <FirstPage
          filters={filtersVisualMap}
          log={list?.[0]}
          showProcessSection={showProcessSection}
          checklist={process}
          selectedFacility={selectedFacility}
        />
        <PdfFooter
          profile={profile}
          selectedFacility={selectedFacility}
          dateAndTimeStampFormat={dateAndTimeStampFormat}
        />
      </Page>

      {pagesByRows.map((_, rowsPagesIndex) =>
        pagesByColumns.map((_, i) => (
          <Page style={commonPdfStyles.page} orientation="landscape" key={i}>
            <PdfHeader logoUrl={settings?.logoUrl} />
            <View style={styles.container}>{renderTableRow(i, rowsPagesIndex)}</View>
            <PdfFooter
              profile={profile}
              selectedFacility={selectedFacility}
              dateAndTimeStampFormat={dateAndTimeStampFormat}
            />
          </Page>
        )),
      )}
    </Document>
  );
};
