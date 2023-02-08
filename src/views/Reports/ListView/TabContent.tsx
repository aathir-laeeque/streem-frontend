import { DataTable, LoadingContainer, PaginatedFetchData, Pagination } from '#components';
import { useTypedSelector } from '#store';
import { openLinkInNewTab } from '#utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchReport, fetchReports, fetchReportSuccess } from './action';

const TabContent = () => {
  const dispatch = useDispatch();

  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  const {
    reports: { list, pageable },
    loading,
    report,
  } = useTypedSelector((state) => state.reports);

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchReports({
        page,
        size,
        sort: 'createdAt,desc',
      }),
    );
  };

  const reportClickHandler = (item) => {
    if (item.type === 'NON_EMBEDDED') {
      dispatch(fetchReport({ id: item.id, useCaseId: selectedUseCase.id }));
    }
  };

  useEffect(() => {
    if (report.id) {
      openLinkInNewTab(report.uri);
    }
  }, [report.id]);

  useEffect(() => {
    if (selectedUseCase?.id) {
      fetchData();
    }
  }, [selectedUseCase?.id]);

  useEffect(() => {
    return () => {
      dispatch(fetchReportSuccess({ data: {}, pageable: { ...pageable, page: 0 } }));
    };
  }, []);

  return (
    <TabContentWrapper>
      <LoadingContainer
        loading={loading}
        component={
          <DataTable
            columns={[
              {
                id: 'name',
                label: 'Report Title',
                minWidth: 240,
                format: function renderComp(item) {
                  return (
                    <span
                      className="primary"
                      onClick={() => reportClickHandler(item)}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  );
                },
              },
            ]}
            rows={list}
          />
        }
      />
      <Pagination pageable={pageable} fetchData={fetchData} />
    </TabContentWrapper>
  );
};

export default TabContent;
