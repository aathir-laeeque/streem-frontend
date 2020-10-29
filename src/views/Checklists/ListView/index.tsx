import { useTabs } from '#components';
import React, { FC } from 'react';

import { Composer } from './styles';
import TabContent from './TabContent';
import { ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: 'Published',
      active: true,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: 'Prototype',
      active: false,
      TabContent,
      passThroughTabContentProps,
    },
  ]);

  return (
    <Composer>
      {renderTabsHeader()}
      {renderTabsContent()}
    </Composer>
  );
};

export default ListView;
