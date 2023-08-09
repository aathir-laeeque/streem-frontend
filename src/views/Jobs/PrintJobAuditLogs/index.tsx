import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiPrintJobActivity } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER } from '#utils/constants';
import { request } from '#utils/request';
import { jobActions } from '#views/Job/jobStore';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import usePdfWorkerHook from '../PdfWorker/usePdfWorkerHook';
import { LoadingDiv } from './styles';

const Download: FC<any> = ({ jobId }) => {
  const [jobDetails, setJobDetails] = useState<PdfJobDataType | undefined>();
  const {
    auditLogs: { logs },
    loading,
  } = useTypedSelector((state) => state.job);
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);
  const { dateAndTimeStampFormat, timeFormat, dateFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );
  const { filters } = useTypedSelector((state) => state.auditLogFilters);

  const dispatch = useDispatch();

  useEffect(() => {
    setKeepPersistedData();
    const fetchJobPdfData = async () => {
      try {
        const response: { data: PdfJobDataType } = await request('GET', apiPrintJobActivity(jobId));
        fetchLogs();
        setJobDetails(response.data);
      } catch (err) {
        console.error('error from fetch job PDF data api ==>', err);
      }
    };

    if (jobId) {
      fetchJobPdfData();
    }
  }, []);

  const fetchLogs = (page = DEFAULT_PAGE_NUMBER, size = 250) => {
    dispatch(
      jobActions.getJobAuditLogs({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  const workerProps = {
    jobId,
    profile,
    settings,
    selectedFacility,
    dateAndTimeStampFormat,
    timeFormat,
    dateFormat,
    logs,
    jobDetails,
    filters,
    type: 'JOB_AUDIT_LOGS',
  };

  usePdfWorkerHook({
    keysToCheck: [
      'jobId',
      'profile',
      'settings',
      'selectedFacility',
      'dateAndTimeStampFormat',
      'timeFormat',
      'dateFormat',
      'logs',
      'jobDetails',
    ],
    loadingKeysToCheck: { loading },
    ...workerProps,
  });

  return <LoadingDiv>Loading...</LoadingDiv>;
};

export default Download;
