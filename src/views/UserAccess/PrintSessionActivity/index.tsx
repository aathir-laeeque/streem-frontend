import React, { FC, useEffect } from 'react';
import { PdfWorkerContainer } from '../../Jobs/PdfWorker/LoadPdfWorker';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import { setKeepPersistedData } from '#utils';
import { fetchSessionActivities } from '../ListView/SessionActivity/actions';
import { DEFAULT_PAGE_NUMBER } from '#utils/constants';

const Download: FC<any> = () => {
  const { logs, loading } = useTypedSelector((state) => state.sessionActivity);
  const { facilityWiseConstants } = useTypedSelector((state) => state);
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.auditLogFilters);
  const { dateAndTimeStampFormat, dateFormat, timeFormat } =
    facilityWiseConstants[selectedFacility!.id];

  const dispatch = useDispatch();

  useEffect(() => {
    setKeepPersistedData();
    fetchLogs();
  }, []);

  const fetchLogs = (page = DEFAULT_PAGE_NUMBER, size = 250) => {
    dispatch(fetchSessionActivities({ size, filters, sort: 'triggeredAt,desc', page }));
  };

  const workerProps = {
    profile,
    settings,
    logs,
    selectedFacility,
    dateAndTimeStampFormat,
    dateFormat,
    timeFormat,
    type: 'SESSION_ACTIVITY_LOGS',
  };

  return (
    <>
      <PdfWorkerContainer loading={!(logs.length && !loading)} {...workerProps} />
    </>
  );
};

export default Download;
