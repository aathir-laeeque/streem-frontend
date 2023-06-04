import { Button, GeneralHeader, Select } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import useTabs from '#components/shared/useTabs';
import { resetComposer } from '#PrototypeComposer/actions';
import { LogType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { CustomViewsTargetType, FilterOperators } from '#utils/globalTypes';
import {
  addCustomView,
  deleteCustomView,
  getCustomViews,
} from '#views/Checklists/ListView/actions';
import { DeleteOutlineOutlined } from '@material-ui/icons';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { components, OptionProps } from 'react-select';
import styled from 'styled-components';
import DynamicContent from './DynamicContent';
import { ViewWrapper } from './styles';
import TabContent from './TabContent';
import { AssignedJobStates, CompletedJobStates, ListViewProps, UnassignedJobStates } from './types';

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

export const commonColumns = [
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job Start',
    triggerType: 'JOB_START_TIME',
    orderTree: 1,
  },
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job Created At',
    triggerType: 'JOB_CREATED_AT',
    orderTree: 2,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Created By',
    triggerType: 'JOB_CREATED_BY',
    orderTree: 3,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Id',
    triggerType: 'JOB_ID',
    orderTree: 4,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job State',
    triggerType: 'JOB_STATE',
    orderTree: 5,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Checklist Id',
    triggerType: 'CHK_ID',
    orderTree: 6,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Checklist Name',
    triggerType: 'CHK_NAME',
    orderTree: 7,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Started By',
    triggerType: 'JOB_STARTED_BY',
    orderTree: 8,
  },
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job End',
    triggerType: 'JOB_END_TIME',
    orderTree: 9,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Ended By',
    triggerType: 'JOB_ENDED_BY',
    orderTree: 10,
  },
];

const defaultViews = [
  {
    label: 'Unassigned',
    values: [UnassignedJobStates.UNASSIGNED],
    tabContent: TabContent,
  },
  {
    label: 'Assigned',
    values: [AssignedJobStates.ASSIGNED, AssignedJobStates.IN_PROGRESS, AssignedJobStates.BLOCKED],
    tabContent: TabContent,
  },
  {
    label: 'Completed',
    values: [CompletedJobStates.COMPLETED, CompletedJobStates.COMPLETED_WITH_EXCEPTION],
    tabContent: TabContent,
  },
];

const AfterHeader: FC<any> = ({ setActiveTab, activeTab }) => {
  const dispatch = useDispatch();
  const {
    checklistListView: { customViews },
    auth: { selectedUseCase },
  } = useTypedSelector((state) => state);

  const handleSetActiveTab = (view: any) => {
    if (view.id) {
      setActiveTab({
        label: view.label,
        tabContent: DynamicContent,
        values: { id: view.id },
      });
    } else {
      setActiveTab(view);
    }
  };

  const onPrimary = (data: any) => {
    dispatch(
      addCustomView({
        data: {
          ...data,
          filters: [],
          columns: commonColumns,
          targetType: CustomViewsTargetType.JOB,
          useCaseId: selectedUseCase?.id!,
        },
        setActiveTab: handleSetActiveTab,
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

  const handleDeleteView = (view: any) => {
    dispatch(deleteCustomView({ view }));
    if (activeTab.label === view.label) {
      setActiveTab(defaultViews[0]);
    }
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

  return (
    <AfterHeaderWrapper>
      <Button variant="secondary" onClick={handleAddNew}>
        Add New
      </Button>
      <Select
        options={[...defaultViews, ...Object.values(customViews.views)]}
        value={[{ value: 'more views', label: 'More Views' }]}
        components={{ Option }}
        onChange={handleSetActiveTab}
        style={{ minWidth: 180 }}
      />
    </AfterHeaderWrapper>
  );
};

const JobListView: FC<ListViewProps> = () => {
  const dispatch = useDispatch();
  const { selectedUseCase } = useTypedSelector((state) => state.auth);
  const {
    checklistListView: { customViews },
  } = useTypedSelector((state) => state);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      ...defaultViews,
      ...Object.values(customViews.views).map((view: any) => ({
        label: view.label,
        tabContent: DynamicContent,
        values: { id: view.id },
      })),
    ],
    AfterHeader: {
      Component: AfterHeader,
    },
  });

  useEffect(() => {
    dispatch(
      getCustomViews({
        filters: {
          op: FilterOperators.AND,
          fields: [
            {
              field: 'useCaseId',
              op: FilterOperators.EQ,
              values: [selectedUseCase?.id!],
            },
            { field: 'archived', op: FilterOperators.EQ, values: [false] },
            {
              field: 'targetType',
              op: FilterOperators.EQ,
              values: [CustomViewsTargetType.JOB],
            },
          ],
        },
      }),
    );
    return () => {
      dispatch(resetComposer());
    };
  }, []);

  return (
    <ViewWrapper>
      <GeneralHeader
        heading={`${selectedUseCase?.label} - Jobs`}
        subHeading="Create, Assign and view Completed Jobs"
      />
      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default JobListView;
