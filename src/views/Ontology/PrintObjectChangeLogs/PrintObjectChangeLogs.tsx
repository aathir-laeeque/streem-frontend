import { PdfFooter, PdfHeader, TableRow, commonPdfStyles } from '#components/documents';
import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
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

const ROWS_PER_PAGE = 12;

export const MyPrintObjectChangeLogs: FC<any> = ({
  list,
  profile,
  settings,
  pdfMetaData,
  dateAndTimeStampFormat,
  filtersVisualMap,
  selectedFacility,
}) => {
  const pagesByRows = Array.from(
    {
      length: Math.ceil(list.length / ROWS_PER_PAGE),
    },
    (_, i) => i,
  );

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
        return formatDateTime({ value: data?.input, format: dateAndTimeStampFormat });
      default:
        return data?.input;
    }
  };

  const renderTableRow = (rowByPageIndex: number) => {
    return (
      <View>
        <TableRow
          fixed
          columns={[
            {
              text: 'Change Done To',
              customStyle: {
                width: '20%',
                paddingVertical: 8,
              },
            },
            {
              text: 'Changed To',
              customStyle: {
                width: '20%',
                paddingVertical: 8,
              },
            },
            {
              text: 'Change Done At',
              customStyle: {
                width: '20%',
                paddingVertical: 8,
              },
            },
            {
              text: 'Change Done By',
              customStyle: {
                width: '20%',
                paddingVertical: 8,
              },
            },
            {
              text: 'Reason',
              customStyle: {
                width: '20%',
                paddingVertical: 8,
              },
            },
          ]}
          customStyle={{
            backgroundColor: '#dadada',
          }}
        />
        {list
          .slice(rowByPageIndex * ROWS_PER_PAGE, rowByPageIndex * ROWS_PER_PAGE + ROWS_PER_PAGE)
          .map((currLog: any) => (
            <TableRow
              fixed
              columns={[
                {
                  text: currLog?.entityDisplayName ? currLog.entityDisplayName : 'Usage Status',
                  customStyle: {
                    width: '20%',
                  },
                },
                {
                  text: getLogValues(currLog),
                  customStyle: {
                    width: '20%',
                  },
                },
                {
                  text: currLog?.modifiedAt
                    ? formatDateTime({ value: currLog?.modifiedAt, format: dateAndTimeStampFormat })
                    : 'N/A',
                  customStyle: {
                    width: '20%',
                  },
                },
                {
                  text: `${currLog?.modifiedBy?.firstName} ${currLog?.modifiedBy?.lastName} (ID: ${currLog?.modifiedBy?.employeeId})`,
                  customStyle: {
                    width: '20%',
                  },
                },
                {
                  text: currLog?.reason
                    ? currLog?.info
                      ? `${currLog?.reason} ${currLog?.info?.processName} (ID: ${currLog?.info?.jobCode})`
                      : currLog?.reason
                    : 'N/A',
                  customStyle: {
                    width: '20%',
                  },
                },
              ]}
              customStyle={{
                backgroundColor: '#ffffff',
              }}
            />
          ))}
      </View>
    );
  };

  return (
    <Document>
      <Page style={commonPdfStyles.page} orientation="landscape">
        <PdfHeader logoUrl={settings?.logoUrl} />
        <FirstPage filters={filtersVisualMap} objectDetails={pdfMetaData} />
        <PdfFooter
          profile={profile}
          selectedFacility={selectedFacility}
          dateAndTimeStampFormat={dateAndTimeStampFormat}
        />
      </Page>
      {pagesByRows.map((_, index) => (
        <Page style={commonPdfStyles.page} orientation="landscape">
          <PdfHeader logoUrl={settings?.logoUrl} />
          <View style={styles.container}>{renderTableRow(index)}</View>
          <PdfFooter
            profile={profile}
            selectedFacility={selectedFacility}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
        </Page>
      ))}
    </Document>
  );
};
