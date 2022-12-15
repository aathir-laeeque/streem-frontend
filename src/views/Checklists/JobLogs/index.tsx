import { Button, NestedSelect } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import useTabs from '#components/shared/useTabs';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addCustomView, getCustomView } from '../ListView/actions';
import TabContent from './TabContent';
import DynamicContent from './DynamicContent';
import { useTypedSelector } from '#store';
import { resetComposer } from '#PrototypeComposer/actions';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';

const AfterHeaderWrapper = styled.div`
  display: flex;
  padding: 2px 0px 8px 8px;
  gap: 8px;
  min-width: fit-content;
  flex: 1;
  justify-content: space-between;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  border: solid 1px #8c8c8c;
  padding: 9px 16px;
  gap: 2px;

  .MuiSvgIcon-root {
    font-size: 16px;
  }
`;

const AfterHeader: FC<any> = ({ setActiveTab, checklistId }) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: { data: processData },
    checklistListView: { customViews },
  } = useTypedSelector((state) => state);

  const handleSetActiveTab = (view: any) => {
    setActiveTab({
      label: view.label,
      tabContent: DynamicContent,
      values: { id: view.id, checklistId },
    });
  };

  const onPrimary = (data: any) => {
    dispatch(
      addCustomView({
        data: {
          ...data,
          filters: [],
          columns: (processData?.jobLogColumns || []).map((column: any, i: number) => ({
            ...column,
            orderTree: i + 1,
          })),
        },
        setActiveTab: handleSetActiveTab,
        checklistId,
      }),
    );
  };

  const handleAddNew = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.PUT_CUSTOM_VIEW,
        props: {
          onPrimary,
        },
      }),
    );
  };

  return (
    <AfterHeaderWrapper>
      <Button variant="secondary" onClick={handleAddNew}>
        Add New
      </Button>
      <NestedSelect
        id="more-views-selector"
        label={() => (
          <LabelWrapper>
            More Views <ArrowDropDownOutlinedIcon />
          </LabelWrapper>
        )}
        items={Object.values(customViews.views) as any}
        onChildChange={(value) => {
          handleSetActiveTab(value);
        }}
      />
    </AfterHeaderWrapper>
  );
};

const JobLogs: FC<RouteComponentProps<{ id: string }>> = ({ id }) => {
  const {
    checklistListView: { customViews },
  } = useTypedSelector((state) => state);

  const dispatch = useDispatch();

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      { label: 'Default', tabContent: TabContent, values: { checklistId: id } },
      ...Object.values(customViews.views).map((view: any) => ({
        label: view.label,
        tabContent: DynamicContent,
        values: { id: view.id, checklistId: id },
      })),
    ],
    AfterHeader: {
      Component: AfterHeader,
      props: { checklistId: id },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getCustomView(id));
    }
    return () => {
      dispatch(resetComposer());
    };
  }, []);

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">Job Logs</div>
        <div className="sub-heading">View your Job Logs</div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default JobLogs;
