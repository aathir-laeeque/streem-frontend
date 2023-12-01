import React from 'react';
import { useEffect, useRef } from 'react';
import { LoadingDiv } from '../PrintJob/styles';
import { ProgressBar } from '#components';
import * as Comlink from 'comlink';
import { v4 as uuidv4 } from 'uuid';
import { User } from '#store/users/types';
import { noop } from 'lodash';

export const PdfWorkerContainer = ({
  progress,
  progressName,
  stageNo,
  loadingKeysToCheck,
  progressCallback,
  loading,
  ...rest
}: {
  progress?: number;
  progressName?: string;
  stageNo?: number;
  loading: boolean;
  profile: User;
  loadingKeysToCheck?: string[];
  dateAndTimeStampFormat: string;
  dateFormat: string;
  timeFormat: string;
  selectedFacility: any;
  [key: string]: any;
}) => {
  const creationStarted = useRef(false);

  useEffect(() => {
    if (!creationStarted.current) {
      const allLoadingsAreFalse = loadingKeysToCheck
        ? loadingKeysToCheck.every((key) => rest[key])
        : true;

      if (allLoadingsAreFalse && !loading) {
        creationStarted.current = true;
        pdfWorker(rest, progressCallback);
      }
    }
  }, [loading, rest]);

  return (
    <LoadingDiv>
      Loading...
      <ProgressBar percentage={progress || 0} />
      {progressName && (
        <div style={{ padding: '20px', fontWeight: 'bold' }}>
          Stage {stageNo} : {progressName}
        </div>
      )}
    </LoadingDiv>
  );
};

export const pdfWorker = (request: any, cb = noop) => {
  const worker = new Worker(new URL('./worker.tsx', import.meta.url));
  const pdfWorker = Comlink.wrap(worker);
  pdfWorker.onProgress(Comlink.proxy(cb));
  pdfWorker.generateSingle(request).then((pdfBlob: Blob) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = uuidv4() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.close();
  });
};
