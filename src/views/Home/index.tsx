import { UseCaseLockIcon } from '#assets/svg/UseCaseLockIcon';
import { Header } from '#components';
import { DashboardLayout } from '#components/Layouts';
import { navigationOptions } from '#components/NavigationMenu';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { ALL_FACILITY_ID } from '#utils/constants';
import { fetchUseCaseList, setSelectedUseCase } from '#views/Auth/actions';
import { CircularProgress } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { navigate } from '@reach/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UseCaseCard, Wrapper } from './styles';
import { AppVersionCheck } from '../../AppVersionCheck';

const Home = () => {
  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    fetchingUseCaseList,
    useCases,
    selectedFacility: { id: facilityId = '' } = {},
  } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUseCaseList());
  }, []);

  return fetchingUseCaseList ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <Wrapper>
      <AppVersionCheck>
        <DashboardLayout>
          <Header />

          <div className="home-view">
            <div className="greeting-text">
              Welcome,
              <br />
              <span>
                {firstName} {lastName}
              </span>
            </div>
            <div className="use-case-list-wrapper">
              {Object.values(useCases).map((useCaseDetails) => (
                <UseCaseCard
                  cardColor={useCaseDetails.metadata['card-color']}
                  cardEnabled={useCaseDetails.enabled}
                >
                  {!useCaseDetails.enabled && <UseCaseLockIcon className="use-case-lock-icon" />}
                  <div className="use-case-card-body">
                    <div className="use-case-label">{useCaseDetails.label}</div>
                    <div className="use-case-desc">{useCaseDetails.description}</div>
                  </div>
                  <div
                    className="use-case-card-footer"
                    onClick={() => {
                      if (useCaseDetails.enabled) {
                        dispatch(setSelectedUseCase(useCaseDetails));
                        let navigateTo = 'inbox';
                        Object.keys(navigationOptions).every((key) => {
                          if (
                            checkPermission([
                              facilityId === ALL_FACILITY_ID ? 'globalSidebar' : 'sidebar',
                              key,
                            ])
                          ) {
                            navigateTo = key;
                            return false;
                          }
                          return true;
                        });
                        navigate(`/${navigateTo}`);
                      }
                    }}
                  >
                    <div className="use-case-card-footer-text">View</div>
                    <ArrowForwardIcon className="use-case-card-footer-icon" />
                  </div>
                </UseCaseCard>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </AppVersionCheck>
    </Wrapper>
  );
};

export default Home;
