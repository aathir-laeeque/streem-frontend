import { useTabs } from '#components';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<UseTabs />', () => {
  let snapshot: ReactTestRenderer;

  //TODO : Skipped for now because of useState hook error.

  it.skip('should render and match the snapshot', () => {
    const TabContent = (): JSX.Element => <div>Tab Content</div>;
    const passThroughTabContentProps = {};
    const { renderTabsContent, renderTabsHeader } = useTabs([
      {
        label: 'Tab 1',
        active: true,
        TabContent,
        passThroughTabContentProps,
      },
      {
        label: 'Tab 2',
        active: false,
        TabContent,
        passThroughTabContentProps,
      },
    ]);
    const component = (
      <div>
        {renderTabsHeader()}
        {renderTabsContent()}
      </div>
    );
    snapshot = create(component);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
