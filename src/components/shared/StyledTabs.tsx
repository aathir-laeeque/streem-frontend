import { ExtendButtonBase, Tab, Tabs, TabsProps, TabsTypeMap } from '@material-ui/core';
import { TabContext, TabPanel, TabPanelProps } from '@material-ui/lab';
import { navigate, useLocation } from '@reach/router';
import React, { FC } from 'react';
import styled from 'styled-components';

export const TabsWrapper = styled.div`
  flex: 1;
`;

export const StyledTabList = styled(Tabs)`
  .MuiTabs-flexContainer {
    border-bottom: 1px solid #e0e0e0;

    > button {
      text-transform: unset;
    }

    .MuiTab-root {
      min-width: unset;
      .MuiTab-wrapper {
        align-items: flex-start;
        font-size: 14px;
        line-height: 1.14;
        letter-spacing: 0.16px;
        color: '#161616';
      }
    }
    .Mui-selected {
      .MuiTab-wrapper {
        font-weight: bold;
      }
    }
  }
  .MuiTabs-indicator {
    background-color: #1d84ff;
    height: 1px;
  }
`;

export const StyledTabPanel = styled(TabPanel)`
  flex: 1;
`;

export type StyledTabType = {
  value: string;
  label: string;
  panelContent: JSX.Element;
  panelProps?: Partial<TabPanelProps>;
  tabHeaderProps?: ExtendButtonBase<TabsTypeMap>;
};

export type StyledTabProps = {
  tabs: StyledTabType[];
  activeTab?: string;
  tabListProps?: TabsProps;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  panelsProps?: Partial<TabPanelProps>;
  onChange?: (value: string) => void;
  queryString?: boolean;
};

export const StyledTabs: FC<StyledTabProps> = ({
  activeTab,
  tabs,
  tabListProps,
  containerProps,
  panelsProps,
  onChange,
  queryString = false,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const currentValue = params.get('tab') || activeTab || tabs?.[0]?.value;

  const handleChange: TabsTypeMap['props']['onChange'] = (_, newValue) => {
    if (queryString) {
      navigate(`?tab=${newValue}`);
    } else {
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const tabList: JSX.Element[] = [];
  const tabPanels: JSX.Element[] = [];

  tabs.forEach((tab) => {
    tabList.push(
      <Tab key={tab.value + 'head'} label={tab.label} value={tab.value} {...tab.tabHeaderProps} />,
    );
    tabPanels.push(
      <StyledTabPanel
        key={tab.value + 'panel'}
        value={tab.value}
        {...panelsProps}
        {...tab.panelProps}
      >
        {tab.panelContent}
      </StyledTabPanel>,
    );
  });

  return (
    <TabContext value={currentValue}>
      <TabsWrapper {...containerProps}>
        <StyledTabList
          value={currentValue}
          onChange={handleChange}
          variant="fullWidth"
          {...tabListProps}
        >
          {tabList}
        </StyledTabList>
        {tabPanels}
      </TabsWrapper>
    </TabContext>
  );
};
