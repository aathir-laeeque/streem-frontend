import useTabs from '#components/shared/useTabs';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import React, { FC } from 'react';
import TabContent from './TabContent';
import { ListViewProps } from './types';
import { GeneralHeader } from '#components';

const ChecklistListView: FC<ListViewProps> = ({}) => {
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      { label: 'published', tabContent: TabContent },
      ...(checkPermission(['checklists', 'prototype'])
        ? [
            {
              label: 'prototype',
              tabContent: TabContent,
            },
          ]
        : []),
    ],
  });

  return (
    <ViewWrapper>
      <GeneralHeader
        heading={`${selectedUseCase?.label} - Checklists`}
        subHeading="Create, view or edit your Checklists and Prototypes"
      />
      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default ChecklistListView;
