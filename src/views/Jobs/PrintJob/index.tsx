import { ProgressBar } from '#components';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiGetObjectTypes, apiPrintJobDetails } from '#utils/apiUrls';
import { generateVariationData, getParameters, getVariationData } from '#utils/parameterUtils';
import { request } from '#utils/request';
import React, { FC, useEffect, useRef, useState } from 'react';
import { PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import { PdfWorkerContainer } from '../PdfWorker/LoadPdfWorker';
import { PrintJobProps } from './types';
import { COMPLETED_JOB_STATES, MandatoryParameter } from '#types';
import { createFetchList } from '#hooks/useFetchData';
import { objectTypesUrlParams } from '#views/Job/overlays/ParameterVariationContent';
import { FilterOperators } from '#utils/globalTypes';

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
  const objectTypeIds = useRef<string[]>([]);
  const [variationData, setVariationData] = useState({});
  const { parameters } = useTypedSelector((state) => state.job);
  const {
    list: objectTypesList,
    reset: resetObjectTypesList,
    status: objectTypesListStatus,
  } = createFetchList(apiGetObjectTypes(), objectTypesUrlParams, false);
  const isInitiated = useRef(false);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  const getObjectTypeIdsForResourceParameters = (list, parameters) => {
    Object.values(list)?.map((item) => {
      if (item.data[0].parameterType === MandatoryParameter.RESOURCE) {
        const parameter = item && parameters[item.data[0].parameterId];
        if (parameter) {
          objectTypeIds.current.push(parameter.data.objectTypeId);
        }
      }
    });

    if (objectTypeIds.current.length > 0) {
      resetObjectTypesList({
        params: {
          ...objectTypesUrlParams,
          size: objectTypeIds.current.length,
          filters: {
            op: FilterOperators.AND,
            fields: [{ field: 'id', op: FilterOperators.ANY, values: objectTypeIds.current }],
          },
        },
      });
    }
  };

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
          const { parameters, hiddenIds, variationDetails } = getParameters({
            checklist: response?.data?.checklist,
            parameterValues: response?.data?.parameterValues,
          });
          if (response.data.state in COMPLETED_JOB_STATES) {
            setHiddenIds(hiddenIds);
          }
          setApiData({ parameters, hiddenIds, variationDetails });
          getObjectTypeIdsForResourceParameters(variationDetails, parameters);
          setData(response.data);
          if (objectTypeIds.current.length === 0) {
            const variationPayload = generateVariationData(variationDetails, parameters, []);
            setVariationData(variationPayload);
            setLoading(false);
          }
        } catch (err) {
          console.error('error from fetch job PDF data api ==>', err);
        }
      };

      if (jobId) {
        fetchJobPdfData();
      }
    }
  }, [jobId]);

  useEffect(() => {
    const { parameters, variationDetails } = apiData;
    if (parameters && variationDetails && objectTypesList?.length > 0) {
      const variationPayload = generateVariationData(variationDetails, parameters, objectTypesList);
      setVariationData(variationPayload);
      setLoading(false);
    }
  }, [objectTypesList]);

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
    variationData,
    parameters,
    objectTypesList,
    type: 'JOB',
    progressCallback,
  };

  return (
    <>
      <PdfWorkerContainer
        loading={loading}
        progress={progress}
        progressName={progressName}
        stageNo={stageNo}
        {...workerProps}
      />
    </>
  );
};

export default Download;
