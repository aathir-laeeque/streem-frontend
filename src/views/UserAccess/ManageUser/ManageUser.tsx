import EditUser from '#assets/svg/EditUser';
import InviteExpired from '#assets/svg/InviteExpired';
import PushNew from '#assets/svg/PushNew';
import { Button1, useScrollableSections } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { Option } from '#components/shared/Select';
import { fetchSelectedUserSuccess } from '#store/users/actions';
import { User, UserStates } from '#store/users/types';
import { updateUserProfile } from '#views/Auth/actions';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import {
  addUser,
  archiveUser,
  cancelInvite,
  resendInvite,
  unArchiveUser,
  unLockUser,
} from '../actions';
import { modalBody } from '../ListView/TabContent';
import { createSectionConfig, Toggleables } from './helpers';
import { Composer } from './styles';
// import { roles } from './temp';
import {
  EditUserProps,
  EditUserRequestInputs,
  PAGE_TYPE,
  TogglesState,
} from './types';

const ManageUser: FC<EditUserProps> = ({
  user: selectedUser,
  facilities: list,
  rolePlaceholder,
  isAccountOwner,
  isEditable,
  selectedRoles,
  pageType,
}) => {
  const dispatch = useDispatch();
  const [toggles, setToggles] = useState<TogglesState>({
    [Toggleables.EDIT_PASSWORD]: false,
    [Toggleables.EDIT_QUESTIONS]: false,
  });

  const updateToggles = (key: Toggleables) => {
    setToggles({
      ...toggles,
      [key]: !toggles[key],
    });
  };

  const formData = useForm<EditUserRequestInputs>({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { register, handleSubmit, formState, setValue, reset } = formData;

  useEffect(() => {
    reset({
      firstName: selectedUser?.firstName,
      lastName: selectedUser?.lastName,
      employeeId: selectedUser?.employeeId,
      username: selectedUser?.username,
      email: selectedUser?.email,
      department: selectedUser?.department,
      facilities: selectedUser?.facilities?.map((f) => ({ id: f.id })),
      roles: selectedUser?.roles?.[0]?.id,
    });
    return () => {
      dispatch(fetchSelectedUserSuccess({ data: undefined }));
    };
  }, [selectedUser?.id]);

  register('facilities', { required: true });
  register('roles', { required: true });

  const onSubmit = (data: EditUserRequestInputs) => {
    const body = {
      ...data,
      email: data.email ? data.email.toLowerCase() : null,
      roles: [{ id: data.roles }],
    };
    if (selectedUser?.id && data.facilities) {
      Object.keys(data).forEach(
        (key) => data[key] === undefined && delete data[key],
      );
      reset({
        ...((selectedUser as unknown) as EditUserRequestInputs),
        ...data,
      });
      dispatch(
        updateUserProfile({
          body,
          id: selectedUser.id,
        }),
      );
    } else {
      dispatch(addUser(body));
    }
  };

  const onFacilityChange = (options: Option[] | null) => {
    if (!options) {
      setValue('facilities', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      setValue(
        'facilities',
        options.map((o) => ({ id: o.value as string })),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  };

  const { renderLabels, renderViews } = useScrollableSections(
    createSectionConfig({
      pageType,
      isEditable,
      isAccountOwner,
      rolePlaceholder,
      selectedRoles,
      selectedUser,
      onFacilityChange,
      updateToggles,
      toggles,
      formData,
      facilities: list,
    }),
  );

  const onArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Archiving a User',
          primaryText: 'Archive User',
          onPrimary: () =>
            dispatch(
              archiveUser({
                id: user.id,
              }),
            ),
          body: modalBody('You’re about to archive', user),
        },
      }),
    );
  };

  const onUnArchiveUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Unarchiving a User',
          primaryText: 'Unarchive User',
          onPrimary: () =>
            dispatch(
              unArchiveUser({
                id: user.id,
              }),
            ),
          body: modalBody('You’re about to unarchive', user),
        },
      }),
    );
  };

  const onCancelInvite = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Cancel Invitation',
          primaryText: 'Cancel Invite',
          onPrimary: () =>
            dispatch(
              cancelInvite({
                id: user.id,
              }),
            ),
          body: modalBody('Are you sure you want to cancel the invitation ?'),
        },
      }),
    );
  };

  const onUnlockUser = (user: User) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          title: 'Unlocking a User',
          primaryText: 'Unlock User',
          onPrimary: () =>
            dispatch(
              unLockUser({
                id: user.id,
              }),
            ),
          body: modalBody('You’re about to unlock the account of', user),
        },
      }),
    );
  };

  const ArchiveButton = () => (
    <Button1
      className="primary-button"
      onClick={() => onArchiveUser(selectedUser)}
    >
      Archive
    </Button1>
  );

  const UnArchiveButton = () => (
    <Button1
      className="primary-button"
      onClick={() => onUnArchiveUser(selectedUser)}
    >
      Unarchive
    </Button1>
  );

  const UnlockButton = () => (
    <Button1
      className="primary-button"
      onClick={() => onUnlockUser(selectedUser)}
    >
      Unlock
    </Button1>
  );

  const ResendInviteButton = () => (
    <Button1
      className="primary-button"
      onClick={() => dispatch(resendInvite({ id: selectedUser.id }))}
    >
      Reset Invite
    </Button1>
  );

  const CancelInviteButton = () => (
    <Button1
      className="primary-button"
      color="dark"
      onClick={() => onCancelInvite(selectedUser)}
    >
      Cancel Invite
    </Button1>
  );

  const GenerateNewSecretButton = () => (
    <Button1
      className="primary-button"
      onClick={() => dispatch(resendInvite({ id: selectedUser.id }))}
    >
      Generate New Secret Key
    </Button1>
  );

  const showButtons = () => {
    if (pageType === PAGE_TYPE.EDIT && !isAccountOwner && isEditable) {
      if (selectedUser.archived) {
        return <UnArchiveButton />;
      } else {
        return (
          <>
            {(() => {
              switch (selectedUser.state) {
                case UserStates.ACCOUNT_LOCKED:
                  return (
                    <>
                      <UnlockButton />
                    </>
                  );
                case UserStates.INVITE_CANCELLED:
                  return (
                    <>
                      <ArchiveButton />
                      <ResendInviteButton />
                    </>
                  );
                case UserStates.INVITE_EXPIRED:
                  return (
                    <>
                      <ArchiveButton />
                      <ResendInviteButton />
                    </>
                  );
                case UserStates.REGISTERED_LOCKED:
                  return (
                    <>
                      <ArchiveButton />
                      <UnlockButton />
                    </>
                  );
                case UserStates.UNREGISTERED:
                  return (
                    <>
                      <GenerateNewSecretButton />
                      <CancelInviteButton />
                    </>
                  );
                case UserStates.UNREGISTERED_LOCKED:
                  return (
                    <>
                      <ArchiveButton />
                      <UnlockButton />
                    </>
                  );
                default:
                  return <ArchiveButton />;
              }
            })()}
          </>
        );
      }
    }

    return null;
  };

  const isInviteExpired = selectedUser?.state === UserStates.INVITE_EXPIRED;

  const renderIcon = () => {
    if (pageType === PAGE_TYPE.ADD) {
      return <PushNew />;
    } else if (isInviteExpired) {
      return <InviteExpired />;
    }

    return <EditUser />;
  };

  return (
    <Composer onSubmit={handleSubmit(onSubmit)}>
      {renderLabels()}
      {renderViews()}
      <div className="action-sidebar">
        {isInviteExpired && (
          <span className="registration-info alert">
            Invitation to register has expired for this user.
          </span>
        )}

        {renderIcon()}

        {selectedUser?.state === UserStates.UNREGISTERED && (
          <span className="registration-info">
            User has not registered yet.
          </span>
        )}

        {showButtons()}

        <Button1
          className="primary-button"
          type="submit"
          variant={pageType === PAGE_TYPE.EDIT ? 'secondary' : 'primary'}
          disabled={!formState.isValid || !formState.isDirty}
        >
          Save Changes
        </Button1>
        <Button1
          className="cancel-button"
          variant="textOnly"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button1>
      </div>
    </Composer>
  );
};

export default ManageUser;
