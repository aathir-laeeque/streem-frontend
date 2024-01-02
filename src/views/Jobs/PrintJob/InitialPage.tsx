import { PdfHeader, commonPdfStyles } from '#components/documents';
import { Document, Page } from '@react-pdf/renderer';
import React, { FC } from 'react';
import { CommonJobPdfDetails } from '../Components/Documents/CommonJobPDFDetails';
import { PrintContext } from './PrintContext';

export const InitialPage: FC<any> = ({
  data,
  dateAndTimeStampFormat,
  dateFormat,
  timeFormat,
  settings,
  selectedFacility,
  profile,
  code,
  hiddenIds,
  variationData,
}) => {
  return (
    <PrintContext.Provider
      value={{
        dateAndTimeStampFormat,
        timeFormat,
        dateFormat,
        selectedFacility,
        profile,
        extra: {
          hiddenIds,
          variationData,
        },
      }}
    >
      <Document title={code}>
        <Page style={commonPdfStyles.page}>
          <PdfHeader logoUrl={settings?.logoUrl} />
          <CommonJobPdfDetails
            jobPdfData={data}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
            dateFormat={dateFormat}
          />
        </Page>
      </Document>
    </PrintContext.Provider>
  );
};
