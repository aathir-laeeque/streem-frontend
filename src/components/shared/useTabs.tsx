import React, { FC, useState } from 'react';
import styled from 'styled-components';

export const HeaderWrapper = styled.div.attrs({
  className: 'tab-header',
})`
  background-color: transparent;
  display: flex;
  grid-area: tab-header;
  overflow-x: hidden;

  .tab-header-items {
    display: flex;
    overflow-x: auto;
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
  BeforeHeader?: {
    Component: FC<any>;
    props?: any;
  };
  AfterHeader?: {
    Component: FC<any>;
    props?: any;
  };
};

const useTabs = ({ tabs, BeforeHeader, AfterHeader }: useTabType) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const TabContent = activeTab.tabContent;

  const renderTabHeader = () => (
    <HeaderWrapper>
      {BeforeHeader && (
        <BeforeHeader.Component
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          {...BeforeHeader.props}
        />
      )}
      <div className="tab-header-items">
        {tabs.map((tab) => (
          <div
            className={`tab-header-item ${activeTab.label === tab.label ? 'active' : ''}`}
            key={tab.label}
            onClick={() => setActiveTab(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {AfterHeader && (
        <AfterHeader.Component
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          {...AfterHeader.props}
        />
      )}
    </HeaderWrapper>
  );

  const renderTabContent = () => (
    <BodyWrapper>
      <TabContent label={activeTab.label} values={activeTab?.values} key={activeTab.label} />
    </BodyWrapper>
  );

  return { renderTabHeader, renderTabContent };
};

export default useTabs;
