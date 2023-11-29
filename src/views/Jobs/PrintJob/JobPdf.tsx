import logo from '#assets/images/logo.png';
import {
  PdfFooter,
  PdfHeader,
  PdfText,
  commonPdfStyles,
  pdfHeaderStyles,
} from '#components/documents';
import { Document, Image, Page, StyleSheet, View } from '@react-pdf/renderer';
import React, { FC } from 'react';
import { CommonJobPdfDetails } from '../Components/Documents/CommonJobPDFDetails';
import { PrintContext } from './PrintContext';
import TaskView from './Task';

const styles = StyleSheet.create({
  stageHeader: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 6,
  },
  stageHeaderInfo: { fontWeight: 600, fontSize: 10, color: '#666666' },
  stageName: {
    marginVertical: 2,
    fontWeight: 800,
  },
});

export const JobPdf: FC<any> = ({
  profile,
  settings,
  selectedFacility,
  dateAndTimeStampFormat,
  timeFormat,
  dateFormat,
  data,
  hiddenIds,
  renderInitialPage = false,
}) => {
  const { checklist, code } = data;

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
        },
      }}
    >
      <Document title={code}>
        <Page style={commonPdfStyles.page}>
          {renderInitialPage ? (
            <PdfHeader logoUrl={settings?.logoUrl} />
          ) : (
            <View style={pdfHeaderStyles.header} fixed>
              <Image src={logo} style={{ height: '24px' }} />
              <PdfText style={{ fontWeight: 700 }}>Job ID : {code}</PdfText>
            </View>
          )}
          {renderInitialPage && (
            <CommonJobPdfDetails
              jobPdfData={data}
              dateAndTimeStampFormat={dateAndTimeStampFormat}
              dateFormat={dateFormat}
            />
          )}
          {checklist?.stages.map((stage: any) => {
            if (hiddenIds[stage.id] === undefined) {
              return (
                <View key={`${stage.id}`} break={renderInitialPage}>
                  <View style={styles.stageHeader}>
                    <View style={commonPdfStyles.flexGrid}>
                      <PdfText style={styles.stageHeaderInfo}>Stage {stage.orderTree}</PdfText>
                      <PdfText style={styles.stageHeaderInfo}>Tasks {stage.tasks.length}</PdfText>
                    </View>
                    <PdfText style={styles.stageName}>{stage.name}</PdfText>
                  </View>
                  {(stage.tasks as unknown as Array<any>).map((task) => {
                    if (hiddenIds[task.id] === undefined) {
                      return (
                        <TaskView task={task} stageOrderTree={stage.orderTree} key={task.id} />
                      );
                    }
                  })}
                </View>
              );
            }
          })}
          <PdfFooter
            dateAndTimeStampFormat={dateAndTimeStampFormat}
            selectedFacility={selectedFacility}
            profile={profile}
            pageInfo={false}
          />
        </Page>
      </Document>
    </PrintContext.Provider>
  );
};
