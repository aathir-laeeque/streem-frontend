import { Button, DataTable, useDrawer } from '#components';
import { useTypedSelector } from '#store';
import { formatDateTimeToHumanReadable } from '#utils/timeUtils';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import schedulersActionObjects from '../schedulerStore';

const VersionHistoryDrawerWrapper = styled.form.attrs({})`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding-block: 10px;
  .version-details {
    display: flex;
    gap: 2px;
  }
`;

const VersionHistoryDrawer: FC<{
  onCloseDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  schedular: Record<string, string>;
  setReadOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateSchedulerDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedScheduler: React.Dispatch<React.SetStateAction<any>>;
}> = ({
  onCloseDrawer,
  schedular,
  setReadOnly,
  setCreateSchedulerDrawer,
  setSelectedScheduler,
}) => {
  const dispatch = useDispatch();
  const { schedulerActions } = schedulersActionObjects;
  const { active } = useTypedSelector((state) => state.schedular);

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      onCloseDrawer(false);
    }, 200);
  };

  const fetchData = () => {
    // const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(schedulerActions.fetchSchedulersVersionHistory({ schedularId: schedular.value }));
  };

  useEffect(() => {
    if (schedular.value) {
      fetchData();
    }
  }, []);

  const columns = [
    {
      id: 'versionNumber',
      label: 'Version #',
      minWidth: 100,
      format: function renderComp(item: any) {
        return (
          <div className="version-details">
            {item.versionNumber} {item.deprecatedAt === null && <span>(Current)</span>}
          </div>
        );
      },
    },
    {
      id: 'name',
      label: 'Scheduler Name',
      minWidth: 100,
      format: function renderComp(item: any) {
        return (
          <span
            className="primary"
            onClick={() => {
              setCreateSchedulerDrawer(true);
              setReadOnly(true);
              setSelectedScheduler(item);
            }}
          >
            {item.name}
          </span>
        );
      },
    },
    {
      id: 'id',
      label: 'Scheduler ID',
      minWidth: 100,
      format: function renderComp(item: any) {
        return <div key={item?.id}>{item?.code}</div>;
      },
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      minWidth: 100,
      format: function renderComp(item: any) {
        return <div key={item?.id}>{formatDateTimeToHumanReadable(item?.audit?.createdAt)}</div>;
      },
    },
  ];

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'View History',
    hideCloseIcon: true,
    bodyContent: (
      <VersionHistoryDrawerWrapper>
        <DataTable columns={columns} rows={active?.versions || []} emptyTitle="No Versions Found" />
      </VersionHistoryDrawerWrapper>
    ),
    footerContent: (
      <>
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Close
        </Button>
      </>
    ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return <VersionHistoryDrawerWrapper>{StyledDrawer}</VersionHistoryDrawerWrapper>;
};

export default VersionHistoryDrawer;
