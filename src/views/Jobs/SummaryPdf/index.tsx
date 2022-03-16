import { ExceptionReason } from '#JobComposer/modals/CompleteJobWithException';
import { useTypedSelector } from '#store';
import { apiGetJobSummary } from '#utils/apiUrls';
import { request } from '#utils/request';
import { RouteComponentProps } from '@reach/router';
import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { CompletedJobStates, Job } from '../NewListView/types';
import { JobSummary } from '../Summary/types';
import CWEReason from './CWEReason';
import DurationSummary from './DurationSummary';
import ExceptionSummary from './ExceptionSummary';
import Footer from './Footer';
import Header from './Header';
import JobData from './JobData';
import JobDetails from './JobDetails';
import { styles } from './styles';

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

type State = {
  loading: boolean;
  data: JobSummary | null;
};

const JobSummaryPdf = ({ jobId }: Props) => {
  const { profile, settings, selectedFacility } = useTypedSelector(
    (state) => state.auth,
  );

  const { timeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const [{ loading, data }, setState] = useState<State>({
    loading: false,
    data: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setState((prevState) => ({
          ...prevState,
          loading: !prevState.loading,
        }));

        const jobSummaryData = await request(
          'GET',
          apiGetJobSummary(jobId as string),
        );

        if (jobSummaryData.data) {
          setState((prevState) => ({
            ...prevState,
            loading: !prevState.loading,
            data: jobSummaryData.data,
          }));
        } else {
          console.error('error in api response :: ', jobSummaryData?.errors);
          setState((prevState) => ({
            ...prevState,
            loading: !prevState.loading,
          }));
        }
      } catch (error) {
        console.error('error occurred in api call :: ', error);
      }
    })();
  }, []);

  if (loading || !data || !profile) {
    return null;
  }

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page}>
          <Header logoUrl={settings?.logoUrl ?? ''} />

          <View style={styles.container}>
            <Text style={styles.title}>Job Summary</Text>

            {data?.state === CompletedJobStates['COMPLETED_WITH_EXCEPTION'] ? (
              <Text style={styles.cweTitle}>
                This Job was completed with Exception
              </Text>
            ) : null}

            <JobData
              endedAt={data.endedAt}
              startedAt={data.startedAt}
              totalDuration={data.totalDuration}
              totalTaskExceptions={data.totalTaskExceptions}
              timeStampFormat={timeStampFormat}
            />

            <JobDetails
              code={data?.code}
              completedBy={data?.completedBy}
              createdBy={data?.createdBy}
              properties={data?.properties}
            />

            {data?.state === CompletedJobStates['COMPLETED_WITH_EXCEPTION'] ? (
              <CWEReason
                comment={data?.cweDetails?.comment ?? ''}
                medias={data?.cweDetails?.medias ?? []}
                reason={
                  ExceptionReason.find(
                    (item) => item.value === data?.cweDetails?.reason,
                  )?.label as string
                }
              />
            ) : null}

            <DurationSummary
              stages={data?.stages ?? []}
              totalStageDuration={data?.totalStageDuration ?? 0}
              totalTaskExceptions={data?.totalTaskExceptions ?? 0}
            />

            <ExceptionSummary
              stages={data?.stages ?? []}
              totalTaskExceptions={data?.totalTaskExceptions ?? 0}
            />
          </View>

          <Footer user={profile} />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default JobSummaryPdf;
