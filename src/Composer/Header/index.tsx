import { Tabs } from '#Composer/composer.types';
import React, { Dispatch, FC, SetStateAction } from 'react';

import JobHeaderButtons from './JobHeaderButtons';
import Wrapper from './styles';

const Header: FC<{
  activeTab: Tabs;
  onTabChange: Dispatch<SetStateAction<Tabs>>;
}> = ({ activeTab, onTabChange }) => {
  return (
    <Wrapper>
      <div
        className={`header-item ${activeTab === Tabs.STAGES ? 'active' : ''}`}
        onClick={() => onTabChange(Tabs.STAGES)}
      >
        Stages
      </div>
      <div
        className={`header-item ${activeTab === Tabs.ACTIVITY ? 'active' : ''}`}
        onClick={() => onTabChange(Tabs.ACTIVITY)}
      >
        Activity
      </div>

      {activeTab === Tabs.STAGES && (
        <>
          <span className="auto-save-text">All changes saved</span>

          <JobHeaderButtons />
        </>
      )}
    </Wrapper>
  );
};

export default Header;
