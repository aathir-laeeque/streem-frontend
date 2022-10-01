import { capitalize } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

export const HeaderWrapper = styled.div.attrs({
  className: 'tab-header',
})`
  background-color: transparent;
  display: flex;
  grid-area: tab-header;

  .tab-header-item {
    align-items: center;
    background-color: #f4f4f4;
    border-top: 2px solid transparent;
    cursor: pointer;
    display: flex;
    min-width: 160px;
    padding: 12px 16px;
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.29;
    letter-spacing: 0.16px;

    &.active {
      background-color: #ffffff;
      border-top-color: #1d84ff;
    }
  }
`;

export const BodyWrapper = styled.div.attrs({
  className: 'tab-body',
})`
  background-color: #ffffff;
  grid-area: tab-body;
  padding: 8px 8px 0px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export type Tab = {
  label: string;
  values?: any;
  tabContent: FC | FC<TabContentProps>;
  passThroughProps?: TabContentProps;
};

export type TabContentProps = {
  label: Tab['label'];
  values?: Tab['values'];
};

type useTabType = {
  tabs: Tab[];
};

const useTabs = ({ tabs }: useTabType) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const TabContent = activeTab.tabContent;

  const renderTabHeader = () => (
    <HeaderWrapper>
      {tabs.map((tab) => (
        <div
          className={`tab-header-item ${activeTab.label === tab.label ? 'active' : ''}`}
          key={tab.label}
          onClick={() => setActiveTab(tab)}
        >
          {capitalize(tab.label)}
        </div>
      ))}
    </HeaderWrapper>
  );

  const renderTabContent = () => (
    <BodyWrapper>
      <TabContent label={activeTab.label} values={activeTab?.values} />
    </BodyWrapper>
  );

  return { renderTabHeader, renderTabContent };
};

export default useTabs;
