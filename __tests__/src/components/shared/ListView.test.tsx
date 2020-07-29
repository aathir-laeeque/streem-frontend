import { ListViewComponent } from '#components';
import { jobs, jobsProperties } from '#mocks';
import { Job } from '#views/Jobs/types';
import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<ListViewComponent />', () => {
  let snapshot: ReactTestRenderer;
  const data: Job[] = jobs.data;
  beforeAll(() => {
    const component = (
      <ListViewComponent
        properties={jobsProperties.data}
        fetchData={() => jest.fn()}
        isLast={true}
        currentPage={0}
        data={data}
        primaryButtonText="Primary Button"
      />
    );
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
