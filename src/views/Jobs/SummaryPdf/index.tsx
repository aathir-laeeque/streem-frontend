import { Checklist } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { User } from '#store/users/types';
import { setKeepPersistedData } from '#utils';
import { apiGetJobSummaryReportDetails } from '#utils/apiUrls';
import { request } from '#utils/request';
import { RouteComponentProps } from '@reach/router';
import { Document, Page, PDFViewer, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { CommonJobPdfDetails, PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import { Job, JobRelation } from '../NewListView/types';
import { JobSummary } from '../Summary/types';
import DurationSummary from './DurationSummary';
import ExceptionSummary from './ExceptionSummary';
import Footer from './Footer';
import Header from './Header';
import { styles } from './styles';

type JobSummaryReportType = JobSummary & {
  assignees: (Pick<User, 'email' | 'id' | 'employeeId' | 'firstName' | 'lastName'> & {
    recentSignOffAt: number;
  })[];
  endedBy: Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName' | 'archived'> | null;
  totalStages: number;
  totalTask: number;
  checklist: Checklist;
  relations: JobRelation[];
};

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

type State = {
  loading: boolean;
  jobSummaryReportDetails: JobSummaryReportType | null;
};

const JobSummaryPdf = ({ jobId }: Props) => {
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);

  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const [{ loading, jobSummaryReportDetails }, setState] = useState<State>({
    loading: false,
    jobSummaryReportDetails: null,
  });

  useEffect(() => {
    setKeepPersistedData();
    (async () => {
      try {
        setState((prevState) => ({
          ...prevState,
          loading: !prevState.loading,
        }));

        if (jobId) {
          const jobSummaryResponse = await request(
            'GET',
            apiGetJobSummaryReportDetails(jobId as string),
          );

          if (jobSummaryResponse.data) {
            setState((prevState) => ({
              ...prevState,
              loading: !prevState.loading,
              jobSummaryReportDetails: jobSummaryResponse.data,
            }));
          } else {
            console.error('error in api response :: ', jobSummaryResponse?.errors);
            setState((prevState) => ({
              ...prevState,
              loading: !prevState.loading,
            }));
          }
        }
      } catch (error) {
        console.error('error occurred in api call :: ', error);
      }
    })();
  }, []);

  if (loading || !jobSummaryReportDetails || !profile) {
    return null;
  }

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page}>
          <Header logoUrl={settings?.logoUrl ?? ''} />

          <CommonJobPdfDetails
            jobPdfData={jobSummaryReportDetails as unknown as PdfJobDataType}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
          <View style={styles.container}>
            <DurationSummary
              stages={jobSummaryReportDetails?.stages ?? []}
              totalStageDuration={jobSummaryReportDetails?.totalStageDuration ?? 0}
              totalTaskExceptions={jobSummaryReportDetails?.totalTaskExceptions ?? 0}
            />

            <ExceptionSummary
              stages={jobSummaryReportDetails?.stages ?? []}
              totalTaskExceptions={jobSummaryReportDetails?.totalTaskExceptions ?? 0}
            />
          </View>

          <Footer
            user={profile}
            selectedFacility={selectedFacility!}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default JobSummaryPdf;
