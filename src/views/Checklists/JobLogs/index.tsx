import { Button, GeneralHeader, Select } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import useTabs from '#components/shared/useTabs';
import { resetComposer } from '#PrototypeComposer/actions';
import { useTypedSelector } from '#store';
import { CustomViewsTargetType, FilterOperators } from '#utils/globalTypes';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { DeleteOutlineOutlined } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { components, OptionProps } from 'react-select';
import styled from 'styled-components';
import { addCustomView, deleteCustomView, getCustomViews } from '../ListView/actions';
import DynamicContent from './DynamicContent';
import TabContent from './TabContent';

const AfterHeaderWrapper = styled.div`
  display: flex;
  padding: 2px 0px 8px 8px;
  gap: 8px;
  min-width: fit-content;
  flex: 1;
  justify-content: space-between;

  .custom-select__menu-list {
    position: fixed;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;

  .delete-icon {
    margin: 0;
    color: #161616;
    :hover {
      color: #ff6b6b;
    }
  }
`;

const AfterHeader: FC<any> = ({ setActiveTab, activeTab, checklistId, defaultView }) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: { data: processData },
    checklistListView: { customViews },
  } = useTypedSelector((state) => state);

  const handleSetActiveTab = (view: any) => {
    setActiveTab({
      label: view.label,
      tabContent: view.id ? DynamicContent : TabContent,
      values: { id: view.id, checklistId },
    });
  };

  const onPrimary = (data: any) => {
    dispatch(
      addCustomView({
        data: {
          ...data,
          columns: (processData?.jobLogColumns || []).map((column: any, i: number) => ({
            ...column,
            orderTree: i + 1,
          })),
          filters: [
            {
              key: 'checklistId',
              constraint: FilterOperators.EQ,
              value: checklistId,
            },
          ],
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

  const onClickDeleteView = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, view: any) => {
    e.stopPropagation();
    dispatch(
      openOverlayAction({
        type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
        props: {
          header: 'Delete View',
          body: <span>{`Are you sure you want to delete “${view.label}” view?`}</span>,
          onPrimaryClick: () => handleDeleteView(view),
        },
      }),
    );
  };

  const handleDeleteView = (view: any) => {
    dispatch(deleteCustomView({ view }));
    if (activeTab.label === view.label) {
      setActiveTab(defaultView);
    }
  };

  const Option = (props: OptionProps<any>) => {
    return (
      <components.Option {...props}>
        <OptionWrapper>
          {props.label}
          {props.data.id && (
            <DeleteOutlineOutlined
              className="delete-icon"
              onClick={(e) => onClickDeleteView(e, props.data)}
            />
          )}
        </OptionWrapper>
      </components.Option>
    );
  };

  return (
    <AfterHeaderWrapper>
      <Button variant="secondary" onClick={handleAddNew}>
        Add New
      </Button>
      <Select
        options={[defaultView, ...Object.values(customViews.views)]}
        value={[{ value: 'more views', label: 'More Views' }]}
        components={{ Option }}
        onChange={handleSetActiveTab}
        style={{ minWidth: 180 }}
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
      props: {
        checklistId: id,
        defaultView: { label: 'Default', tabContent: TabContent, values: { checklistId: id } },
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getCustomViews({
          filters: {
            op: FilterOperators.AND,
            fields: [
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
              {
                field: 'targetType',
                op: FilterOperators.EQ,
                values: [CustomViewsTargetType.PROCESS],
              },
              { field: 'processId', op: FilterOperators.EQ, values: [id] },
            ],
          },
        }),
      );
    }
    return () => {
      dispatch(resetComposer());
    };
  }, []);

  return (
    <ViewWrapper>
      <GeneralHeader heading="Job Logs" subHeading="View your Job Logs" />
      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default JobLogs;
