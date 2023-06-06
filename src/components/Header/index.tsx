import AvatarIcon from '#assets/svg/AvatarIcon';
import Logo from '#assets/svg/Logo';
import MoreOptionsIcon from '#assets/svg/MoreOptionsIcon';
import QRIcon from '#assets/svg/QR';
import SettingsIcon from '#assets/svg/SettingsIcon';
import { NestedSelect, Select } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { switchFacility } from '#store/facilities/actions';
import { logout, setSelectedUseCase } from '#views/Auth/actions';
import { getQrCodeData, qrCodeValidator } from '#views/Ontology/utils';
import { UserType } from '#views/UserAccess/ManageUser/types';
import { useMsal } from '@azure/msal-react';
import { navigate } from '@reach/router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ImageWrapper } from '../../styles/ImageWrapper';
import { HeaderMenu, Wrapper } from './styles';

type FacilityOption = {
  label: string;
  value: string;
};

const Header: FC = () => {
  const dispatch = useDispatch();
  const { instance } = useMsal();

  const { profile, facilities, selectedFacility, userId, selectedUseCase, useCaseMap, userType } =
    useTypedSelector((state) => state.auth);

  const facilitiesOptions: FacilityOption[] = facilities.map((facility) => ({
    label: facility.name,
    value: facility.id,
  }));

  const onSelectWithQR = async (data: string) => {
    try {
      const qrData = await getQrCodeData({ shortCode: JSON.stringify(data) });
      if (qrData?.objectId) {
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
    <Wrapper className="header-bar">
      <ImageWrapper className="header-logo">
        <Logo style={{ width: '125px', cursor: 'pointer' }} onClick={() => navigate('/')} />
      </ImageWrapper>
      <div className="right-section">
        <div
          className="qr-scanner"
          onClick={() => {
            dispatch(
              openOverlayAction({
                type: OverlayNames.QR_SCANNER,
                props: { onSuccess: onSelectWithQR },
              }),
            );
          }}
        >
          <QRIcon />
        </div>
        {selectedFacility ? (
          <Select
            options={facilitiesOptions}
            value={facilitiesOptions.find((option) => option.value === selectedFacility?.id)}
            onChange={(option: any) =>
              dispatch(
                switchFacility({
                  facilityId: option.value as string,
                  loggedInUserId: userId!,
                }),
              )
            }
          />
        ) : null}
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
            onChildChange={(option: any) => {
              dispatch(setSelectedUseCase(option));
              navigate('/inbox');
            }}
            label={() => (
              <HeaderMenu>
                <MoreOptionsIcon />
              </HeaderMenu>
            )}
          />
        )}
        {selectedFacility && checkPermission(['header', 'usersAndAccess']) && (
          <NestedSelect
            id="system-settings-selector"
            items={{
              'system-settings': {
                label: 'System Settings',
                items: {
                  'users-and-access': {
                    label: 'Users and Access',
                  },
                },
              },
            }}
            onChildChange={() => {
              navigate('/users');
            }}
            label={() => (
              <HeaderMenu>
                <SettingsIcon />
              </HeaderMenu>
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
          onChildChange={(option: any) => {
            if (option.value === 'my-account') {
              navigate(`/users/profile/${profile?.id}`);
            } else {
              dispatch(logout(userType === UserType.AZURE_AD ? instance : undefined));
            }
          }}
          label={() => (
            <HeaderMenu>
              <AvatarIcon className="profile-icon" />
              <div style={{ fontSize: '16px' }}>
                {profile?.firstName} {profile?.lastName}
              </div>
            </HeaderMenu>
          )}
        />
      </div>
    </Wrapper>
  );
};

export default Header;
