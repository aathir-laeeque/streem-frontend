import Logo from '#assets/svg/Logo';
import QRIcon from '#assets/svg/QR.svg';
import AccountCircle from '#assets/svg/account-circle.svg';
import UseCaseIcon from '#assets/svg/use-case.svg';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { NestedSelect, NestedSelectProps } from '#components/shared/NestedSelect';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { toggleIsDrawerOpen } from '#store/extras/action';
import { switchFacility } from '#store/facilities/actions';
import { ALL_FACILITY_ID } from '#utils/constants';
import { logout, setSelectedUseCase } from '#views/Auth/actions';
import { getQrCodeData, qrCodeValidator } from '#views/Ontology/utils';
import { UserType } from '#views/UserAccess/ManageUser/types';
import { useMsal } from '@azure/msal-react';
import { Divider } from '@material-ui/core';
import { SelectProps } from '@material-ui/core/Select';
import {
  AccountTreeOutlined,
  ArrowForwardIos,
  AssessmentOutlined,
  ChevronLeft,
  DescriptionOutlined,
  MailOutline,
  Menu as MenuIcon,
  PeopleOutline,
  PublicOutlined,
  Settings,
} from '@material-ui/icons';
import { Link, navigate } from '@reach/router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, NavItem, Wrapper } from './styles';
import { MenuItem } from './types';

export const navigationOptions = {
  inbox: { name: 'Inbox', icon: MailOutline },
  jobs: { name: 'Jobs', icon: PeopleOutline },
  checklists: { name: 'Processes', icon: DescriptionOutlined },
  ontology: { name: 'Ontology', icon: AccountTreeOutlined },
  reports: { name: 'Reports', icon: AssessmentOutlined },
};

const menuProps: SelectProps['MenuProps'] = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  transformOrigin: {
    horizontal: -4,
    vertical: 'top',
  },
};

const NavigationMenu: FC = () => {
  const dispatch = useDispatch();
  const { instance } = useMsal();
  const {
    auth: {
      facilities,
      selectedFacility,
      userId,
      selectedUseCase,
      useCaseMap,
      profile,
      userType,
      features,
      ssoIdToken,
    },
    extras: { isDrawerOpen },
  } = useTypedSelector((state) => state);

  const facilitiesOptions = facilities.reduce<NestedSelectProps['items']>((acc, facility) => {
    acc[facility.id] = {
      label: facility.name,
    };
    return acc;
  }, {});

  const menuItems: MenuItem[] = [
    {
      path: '/home',
      icon: () => (
        <div style={{ width: 204 }}>
          <Logo style={{ width: '172px' }} />
        </div>
      ),
    },
  ];
  Object.entries(navigationOptions).forEach(([key, value]) => {
    if (
      checkPermission([selectedFacility?.id === ALL_FACILITY_ID ? 'globalSidebar' : 'sidebar', key])
    ) {
      if (key === 'reports') {
        if (features?.metabaseReports) {
          menuItems.push({ ...value, path: `/${key}` });
        }
      } else {
        menuItems.push({ ...value, path: `/${key}` });
      }
    }
  });

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = await getQrCodeData({
        shortCode: data,
      });
      if (qrData) {
        await qrCodeValidator({
          data: qrData,
          callBack: () =>
            navigate(`/ontology/object-types/${qrData.objectTypeId}/objects/${qrData.objectId}`),
          objectTypeValidation: true,
        });
      }
    } catch (error) {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  return (
    <Wrapper className="navigation-menu">
      <Menu>
        {menuItems.map(({ path, name, icon: Icon }, index) => (
          <Link
            to={path}
            key={`${name}-${index}`}
            getProps={({ location: { pathname } }) => {
              const isActive = pathname.split('/')[1] === path.split('/')[1];

              return {
                style: {
                  color: isActive ? '#ffffff' : '#161616',
                  backgroundColor: isActive ? '#1d84ff' : 'transparent',
                  textDecoration: 'none',
                },
              };
            }}
            onClick={() => isDrawerOpen && dispatch(toggleIsDrawerOpen())}
          >
            <NavItem>
              <Icon size="24" />
              {name && <span>{name}</span>}
            </NavItem>
          </Link>
        ))}
      </Menu>
      <Menu>
        {selectedFacility && (
          <>
            <Divider />
            <NestedSelect
              id="facility-selector"
              items={facilitiesOptions}
              onChildChange={(option) => {
                dispatch(
                  switchFacility({
                    facilityId: option.value as string,
                    loggedInUserId: userId!,
                  }),
                );
              }}
              MenuProps={menuProps}
              label={() => (
                <NavItem>
                  <PublicOutlined />
                  <span>{selectedFacility?.name || ''} Facility</span>
                  <ArrowForwardIos className="secondary-icon" />
                </NavItem>
              )}
            />
            <Divider />
          </>
        )}
        <NavItem
          onClick={() => {
            dispatch(
              openOverlayAction({
                type: OverlayNames.QR_SCANNER,
                props: { onSuccess: onSelectWithQR },
              }),
            );
          }}
        >
          <img src={QRIcon} />
          <span>Scan</span>
        </NavItem>
        {selectedUseCase && !location.pathname.includes('/home') && (
          <NestedSelect
            id="use-case-selector"
            items={Object.values(useCaseMap).reduce<any>((acc, useCase) => {
              if (useCase.enabled) {
                acc[useCase.id] = {
                  ...useCase,
                  disabled: !useCase.enabled,
                };
              }
              return acc;
            }, {})}
            onChildChange={(option) => {
              dispatch(setSelectedUseCase(option));
              navigate('/inbox');
            }}
            MenuProps={menuProps}
            label={() => (
              <NavItem>
                <img src={UseCaseIcon} />
                <span>Use Case</span>
                <ArrowForwardIos className="secondary-icon" />
              </NavItem>
            )}
          />
        )}
        {selectedFacility && checkPermission(['header', 'usersAndAccess']) && (
          <NestedSelect
            id="system-settings-selector"
            items={{
              'users-and-access': {
                label: 'Users and Access',
              },
            }}
            onChildChange={() => {
              navigate('/users');
            }}
            MenuProps={menuProps}
            label={() => (
              <NavItem>
                <Settings />
                <span>Settings</span>
                <ArrowForwardIos className="secondary-icon" />
              </NavItem>
            )}
          />
        )}
        <NestedSelect
          id="account-operations-selector"
          items={{
            ...(selectedFacility && {
              'my-account': {
                label: 'My Account',
              },
            }),
            logout: {
              label: 'Logout',
            },
          }}
          MenuProps={menuProps}
          onChildChange={(option: any) => {
            if (option.value === 'my-account') {
              navigate(`/users/profile/${profile?.id}`);
            } else {
              dispatch(
                logout({
                  instance: userType === UserType.AZURE_AD ? instance : undefined,
                  ssoIdToken: ssoIdToken,
                }),
              );
            }
          }}
          label={() => (
            <NavItem>
              <img src={AccountCircle} />
              <span>
                {profile?.firstName} {profile?.lastName}
              </span>
              <ArrowForwardIos className="secondary-icon" />
            </NavItem>
          )}
        />
        <Divider />
        <NavItem key="nav-drawer-toggle" onClick={() => dispatch(toggleIsDrawerOpen())}>
          {isDrawerOpen ? <ChevronLeft /> : <MenuIcon />}
        </NavItem>
      </Menu>
    </Wrapper>
  );
};

export default NavigationMenu;
