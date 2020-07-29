import { jobs, users } from '#mocks';
import { configureStore } from '#store';
import {
  JobUserAssignModal,
  JobUserAssignModalProps,
} from '#views/Jobs/Modals/JobUserAssignModal';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

describe('<JobUserAssignModal />', () => {
  let store: Store;

  it('it matches the snapshot', () => {
    store = configureStore({
      users: {
        list: users.data,
        pageable: users.pageable,
      },
      jobListView: {
        loading: false,
        selectedStatus: 'unassigned',
        jobs: {
          assigned: {
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
          },
          unassigned: {
            list: jobs.data,
            pageable: jobs.pageable,
          },
        },
      },
    });

    const props: JobUserAssignModalProps = {
      closeAllModals: jest.fn(),
      closeModal: jest.fn(),
      selectedJobIndex: 0,
      refreshData: jest.fn(),
    };

    render(
      <Provider store={store}>
        <JobUserAssignModal {...props} />
      </Provider>,
    );
    expect(screen).toMatchSnapshot();
  });
});
