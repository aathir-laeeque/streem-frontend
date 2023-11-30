import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { formatDateTime } from '#utils/timeUtils';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObjectChangeLogs } from '../actions';
import { PdfWorkerContainer } from '#views/Jobs/PdfWorker/LoadPdfWorker';

const Download: FC<{ objectId: string }> = ({ objectId }) => {
  const {
    auth: { profile, settings, selectedFacility },
    ontology: {
      objectChangeLogs: { list, listLoading },
    },
    auditLogFilters: { filters, pdfMetaData },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat, dateFormat, timeFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );
  const dispatch = useDispatch();
  const [state, setState] = useState<{
    loadingFilters: boolean;
    parsedFilters?: Record<string, any>;
    filtersVisualMap: Record<string, any>;
  }>({
    loadingFilters: true,
    filtersVisualMap: {},
  });
  const { loadingFilters, parsedFilters, filtersVisualMap } = state;

  const fetchFiltersData = (fields: { key: string; constraint: string; value: any }[]) => {
    const fieldsVisualMap: Record<string, any> = {};
    fields.forEach((field) => {
      switch (field.key) {
        case 'modifiedAt':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done At',
            value: formatDateTime({ value: field?.value }),
            op: field.constraint,
          };
          break;
        case 'modifiedBy.id':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done By',
            value: field?.value?.label,
            op: field.constraint,
          };
          break;
        case 'entityId':
          fieldsVisualMap[field.key] = {
            ...fieldsVisualMap[field.key],
            label: 'Change Done To',
            value: field?.value?.label,
            op: field.constraint,
          };
          break;
      }
    });
    return fieldsVisualMap;
  };

  const filterParser = (filter: Record<string, any>) => {
    const newfields = filter.fields.reduce((acc, currFilter) => {
      if (currFilter.field) {
        acc.push(currFilter);
      } else {
        acc.push({
          field: currFilter.key,
          op: currFilter.constraint,
          values: currFilter.value.label ? [currFilter.value.value] : [currFilter.value],
        });
      }
      return acc;
    }, []);
    return { ...filter, fields: newfields };
  };

  useEffect(() => {
    if (parsedFilters?.fields) {
      setKeepPersistedData();
      dispatch(
        fetchObjectChangeLogs({
          page: 0,
          size: 250,
          filters: parsedFilters,
        }),
      );
    }
  }, [parsedFilters]);

  useEffect(() => {
    const _parsedFilters = filterParser(JSON.parse(filters));
    const _filtersVisualMap = fetchFiltersData(JSON.parse(filters).fields);
    setState((prev) => ({
      ...prev,
      parsedFilters: _parsedFilters,
      filtersVisualMap: _filtersVisualMap,
      loadingFilters: false,
    }));
  }, [filters]);

  const workerProps = {
    list,
    profile,
    settings,
    pdfMetaData,
    dateAndTimeStampFormat,
    dateFormat,
    timeFormat,
    filtersVisualMap,
    selectedFacility,
    objectId,
    type: 'OBJECT_CHANGE_LOGS',
  };

  return (
    <>
      <PdfWorkerContainer loading={state.loadingFilters || listLoading} {...workerProps} />
    </>
  );
};

export default Download;
