import { capitalize } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .tab-title {
    font-size: 16px;
    font-weight: normal;
    color: #666666;
    cursor: pointer;
    padding: 14px 32px;
    text-transform: capitalize;
  }

  .tab-active {
    border-bottom: 2px solid #1d84ff;
    color: #1d84ff;
    font-weight: 600;
  }

  .tabs-row {
    display: flex;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
    background: #fff;
  }
`;

export const initialTabState = {
  list: [],
  pageable: {
    page: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  },
};

export interface Tab {
  label: string;
  active: boolean;
  TabContent: FC;
  passThroughTabContentProps?: any;
}

export const useTabs = (tabs: Tab[]) => {
  const [stateTabs, updateTabs] = useState<Tab[]>(tabs);
  const activeTab = stateTabs.find((el) => el.active);
  const renderTabsHeader = (): JSX.Element => (
    <Wrapper>
      <div className="tabs-row">
        {stateTabs.map((tab, index) => (
          <span
            className={`tab-title ${tab.active && 'tab-active'}`}
            key={`tab_${index}`}
            onClick={() =>
              updateTabs(
                tabs.map((el, idx) => ({ ...el, active: idx === index })),
              )
            }
          >
            {capitalize(tab.label)}
          </span>
        ))}
      </div>
    </Wrapper>
  );
  const renderTabsContent = (): JSX.Element => (
    <div style={{ height: 'inherit' }}>
      {stateTabs.map(
        ({ TabContent, label, passThroughTabContentProps }, index) => {
          if (label === activeTab?.label) {
            return (
              <TabContent
                {...passThroughTabContentProps}
                label={label}
                key={`${label}-${index}`}
              />
            );
          } else {
            return null;
          }
        },
      )}
    </div>
  );
  return { renderTabsHeader, renderTabsContent };
};
