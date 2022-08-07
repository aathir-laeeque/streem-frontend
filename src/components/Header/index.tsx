import AvatarIcon from '#assets/svg/AvatarIcon';
import Logo from '#assets/svg/Logo';
import MoreOptionsIcon from '#assets/svg/MoreOptionsIcon';
import SettingsIcon from '#assets/svg/SettingsIcon';
import Select from '#components/shared/Select';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { switchFacility } from '#store/facilities/actions';
import { logout, setSelectedUseCase } from '#views/Auth/actions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { navigate } from '@reach/router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ImageWrapper } from '../../styles/ImageWrapper';
import NestedMenuItem from '../shared/NestedMenuItem';
import { HeaderMenu, Wrapper } from './styles';

type FacilityOption = {
  label: string;
  value: string;
};

const Header: FC = () => {
  const [showUsersDropdown, setShowUsersDropdown] = React.useState<null | HTMLElement>(null);
  const [showSettingsDropDown, setSettingsDropDownVisibiltity] = React.useState<null | HTMLElement>(
    null,
  );
  const dispatch = useDispatch();
  const [showUseCaseSelectionDropDown, setShowUseCaseSelectionDropDown] =
    React.useState<null | HTMLElement>(null);

  const { profile, facilities, selectedFacility, userId, selectedUseCase, useCastList } =
    useTypedSelector((state) => state.auth);

  const facilitiesOptions: FacilityOption[] = facilities.map((facility) => ({
    label: facility.name,
    value: facility.id,
  }));

  return (
    <Wrapper>
      <ImageWrapper>
        <Logo style={{ width: '100px', cursor: 'pointer' }} onClick={() => navigate('/')} />
      </ImageWrapper>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {selectedFacility ? (
          <Select
            options={facilitiesOptions}
            selectedValue={facilitiesOptions.find(
              (option) => option.value === selectedFacility?.id,
            )}
            onChange={(option) =>
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
          <>
            <HeaderMenu
              aria-controls="top-menu"
              aria-haspopup="true"
              onClick={(event) => setShowUseCaseSelectionDropDown(event.currentTarget)}
              style={{ marginRight: '16px' }}
            >
              <MoreOptionsIcon />
            </HeaderMenu>
            <Menu
              id="top-menu"
              anchorEl={showUseCaseSelectionDropDown}
              keepMounted
              open={Boolean(showUseCaseSelectionDropDown)}
              onClose={() => setShowUseCaseSelectionDropDown(null)}
              style={{ marginTop: 30 }}
            >
              {useCastList.map((useCaseDetails) => (
                <MenuItem
                  autoFocus={selectedUseCase.id === useCaseDetails.id}
                  onClick={() => {
                    setShowUseCaseSelectionDropDown(null);
                    dispatch(setSelectedUseCase(useCaseDetails));
                    navigate('/inbox');
                  }}
                  disabled={!useCaseDetails.enabled}
                  key={useCaseDetails.id}
                >
                  {useCaseDetails.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        {selectedFacility && (
          <>
            <HeaderMenu
              aria-controls="top-menu"
              aria-haspopup="true"
              onClick={(event) => setSettingsDropDownVisibiltity(event.currentTarget)}
              style={{ marginRight: '16px' }}
            >
              <SettingsIcon />
            </HeaderMenu>
            <Menu
              id="top-menu"
              anchorEl={showSettingsDropDown}
              keepMounted
              open={Boolean(showSettingsDropDown)}
              onClose={() => setSettingsDropDownVisibiltity(null)}
              style={{ marginTop: 30 }}
            >
              {checkPermission(['header', 'usersAndAccess']) && (
                <NestedMenuItem
                  left
                  label="System Settings"
                  mainMenuOpen={showSettingsDropDown ? true : false}
                >
                  <MenuItem
                    onClick={() => {
                      navigate('/users');
                      setSettingsDropDownVisibiltity(null);
                    }}
                  >
                    Users and Access
                  </MenuItem>
                </NestedMenuItem>
              )}
            </Menu>
          </>
        )}
        <HeaderMenu
          aria-controls="top-menu"
          aria-haspopup="true"
          onClick={(event) => setShowUsersDropdown(event.currentTarget)}
        >
          <div
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            <AvatarIcon className="profile-icon" />
            <div style={{ fontSize: '16px' }}>
              {profile?.firstName} {profile?.lastName}
            </div>
          </div>
        </HeaderMenu>
        <Menu
          id="top-menu"
          anchorEl={showUsersDropdown}
          keepMounted
          open={Boolean(showUsersDropdown)}
          onClose={() => setShowUsersDropdown(null)}
          style={{ marginTop: 30 }}
        >
          {selectedFacility && (
            <MenuItem
              onClick={() => {
                navigate(`/users/profile/${profile?.id}`);
                setShowUsersDropdown(null);
              }}
            >
              My Account
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              dispatch(logout());
              setShowUsersDropdown(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    </Wrapper>
  );
};

export default Header;
