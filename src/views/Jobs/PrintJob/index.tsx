import { ProgressBar } from '#components';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiPrintJobDetails } from '#utils/apiUrls';
import { getParameters } from '#utils/parameterUtils';
import { request } from '#utils/request';
import React, { FC, useEffect, useRef, useState } from 'react';
import { PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import usePdfWorkerHook from '../PdfWorker/usePdfWorkerHook';
import { LoadingDiv } from './styles';
import { PrintJobProps } from './types';
import { COMPLETED_JOB_STATES } from '#types';

const Download: FC<PrintJobProps> = ({ jobId }) => {
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);
  const { facilityWiseConstants } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat, dateFormat, timeFormat } =
    facilityWiseConstants[selectedFacility!.id];
  const [progress, setProgress] = useState(0);
  const [progressName, setProgressName] = useState('Fetching Data...');
  const [stageNo, setStageNo] = useState<number>();
  const [data, setData] = useState<PdfJobDataType | undefined>();
  const [hiddenIds, setHiddenIds] = useState({});
  const isInitiated = useRef(false);

  useEffect(() => {
    if (!isInitiated.current) {
      isInitiated.current = true;
      setKeepPersistedData();
      const fetchJobPdfData = async () => {
        try {
          const response: { data: PdfJobDataType } = await request(
            'GET',
            apiPrintJobDetails(jobId!),
          );
          if (response.data.state in COMPLETED_JOB_STATES) {
            setHiddenIds(getParameters({ checklist: response.data.checklist }).hiddenIds);
          }
          setData(response.data);
        } catch (err) {
          console.error('error from fetch job PDF data api ==>', err);
        }
      };

      if (jobId) {
        fetchJobPdfData();
      }
    }
  }, [jobId]);

  const progressCallback = (val: any, name: string, stageNum: number) => {
    setProgressName(name);
    setProgress(val);
    setStageNo(stageNum);
  };

  const workerProps = {
    jobId,
    hiddenIds,
    profile,
    settings,
    selectedFacility,
    dateAndTimeStampFormat,
    timeFormat,
    dateFormat,
    data,
    type: 'JOB',
    progressCallback,
  };

  usePdfWorkerHook({
    keysToCheck: [
      'dateAndTimeStampFormat',
      'timeFormat',
      'dateFormat',
      'profile',
      'settings',
      'jobId',
      'data',
    ],
    ...workerProps,
  });

  return (
    <LoadingDiv>
      Loading...
      <ProgressBar percentage={progress} />
      {progressName && (
        <div style={{ padding: '20px', fontWeight: 'bold' }}>
          Stage {stageNo} : {progressName}
        </div>
      )}
    </LoadingDiv>
  );
};

export default Download;
