import { ProcessInitialState } from '#PrototypeComposer';
import {
  startChecklistReview,
  submitChecklistForReview,
} from '#PrototypeComposer/reviewer.actions';
import { CollaboratorState, CollaboratorType } from '#PrototypeComposer/reviewer.types';
import ActivityIcon from '#assets/svg/ActivityIcon';
import MemoArchive from '#assets/svg/Archive';
import MemoViewInfo from '#assets/svg/ViewInfo';
import { Button, ListActionMenu } from '#components';
import { closeAllOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission, { RoleIdByName } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { toggleIsDrawerOpen } from '#store/extras/action';
import { ALL_FACILITY_ID } from '#utils/constants';
import { Error } from '#utils/globalTypes';
import { archiveChecklist, unarchiveChecklist } from '#views/Checklists/ListView/actions';
import { FormMode } from '#views/Checklists/NewPrototype/types';
import { MenuItem } from '@material-ui/core';
import {
  DoneAll,
  FiberManualRecord,
  Group,
  Info,
  Menu,
  Message,
  MoreVert,
  Settings,
} from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { validatePrototype } from '../actions';
import {
  Checklist,
  ChecklistStates,
  ChecklistStatesColors,
  ChecklistStatesContent,
} from '../checklist.types';
import HeaderWrapper from './styles';

const ListActionMenuButton = styled(ListActionMenu)`
  .MuiPaper-root {
    right: 16px !important;
    left: auto !important;
    top: 130px !important;
  }
`;

const ChecklistHeader: FC<ProcessInitialState> = ({
  isPrimaryAuthor,
  allDoneOk,
  areReviewsPending,
  reviewer,
  author,
  approver,
  headerNotification,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    data,
    userId,
    listOrder,
    profile,
    selectedFacility: { id: facilityId = '' } = {},
  } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: state.prototypeComposer.data as Checklist,
    listOrder: state.prototypeComposer.stages.listOrder,
    profile: state.auth.profile,
    selectedFacility: state.auth.selectedFacility,
  }));

  const handleSubmitForReview = (isViewer = false, showAssignment = true) => {
    if (showAssignment) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.SUBMIT_REVIEW_MODAL,
          props: {
            isViewer,
            isAuthor: !!author,
            isPrimaryAuthor,
          },
        }),
      );
    } else {
      dispatch(submitChecklistForReview(data.id));
    }
  };

  const handleSendToAuthor = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.SUBMIT_REVIEW_MODAL,
        props: {
          sendToAuthor: true,
          allDoneOk,
        },
      }),
    );
  };

  const onStartReview = () => {
    if (data && data.id) dispatch(startChecklistReview(data?.id));
  };

  const handleStartReview = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          onPrimary: () => onStartReview(),
          primaryText: 'Confirm',
          title: 'Start Reviewing',
          body: <>Are you sure you want to start reviewing this Prototype now?</>,
        },
      }),
    );
  };

  const handleContinueReview = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.SUBMIT_REVIEW_MODAL,
        props: {
          continueReview: true,
          reviewState: reviewer?.state,
        },
      }),
    );
  };

  const renderButtonsForReviewer = (state: CollaboratorState) => {
    switch (state) {
      case CollaboratorState.NOT_STARTED:
        return (
          <>
            <Button className="submit" onClick={handleStartReview}>
              Start Review
            </Button>
          </>
        );
      case CollaboratorState.BEING_REVIEWED:
        return (
          <>
            <Button className="submit" onClick={() => handleSubmitForReview(false)}>
              Provide Review
            </Button>
          </>
        );
      case CollaboratorState.COMMENTED_OK:
      case CollaboratorState.COMMENTED_CHANGES:
        return (
          <>
            {data?.state !== ChecklistStates.SIGNING_IN_PROGRESS && (
              <Button
                className="submit"
                style={{ backgroundColor: '#333333' }}
                onClick={handleContinueReview}
              >
                <Message style={{ fontSize: '16px', marginRight: '8px' }} />
                Continue Review
              </Button>
            )}
            {data?.state !== ChecklistStates.SIGNING_IN_PROGRESS && !areReviewsPending && (
              <Button
                color={allDoneOk ? 'green' : 'blue'}
                className="submit"
                onClick={handleSendToAuthor}
              >
                <DoneAll style={{ fontSize: '16px', marginRight: '8px' }} />
                Send to Author
              </Button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const onInitiateSignOff = () => {
    dispatch(closeAllOverlayAction());
    dispatch(
      openOverlayAction({
        type: OverlayNames.INITIATE_SIGNOFF,
      }),
    );
  };

  const handleInitiateSignOff = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          onPrimary: () => onInitiateSignOff(),
          primaryText: 'Confirm',
          title: 'Initiate Sign Off',
          body: (
            <p style={{ margin: 0, textAlign: 'left' }}>
              Are you sure you want to Initiate the Sign Off?
            </p>
          ),
        },
      }),
    );
  };

  const PrototypeEditButton = () => (
    <Button
      id="edit"
      variant="secondary"
      onClick={() =>
        navigate('prototype', {
          state: {
            mode:
              isPrimaryAuthor &&
              (data?.state === ChecklistStates.BEING_BUILT ||
                data?.state === ChecklistStates.REQUESTED_CHANGES)
                ? FormMode.EDIT
                : FormMode.VIEW,
            formData: {
              description: data?.description,
              name: data.name,
              properties: data.properties,
              authors: data.collaborators.filter((u) => u.type === CollaboratorType.AUTHOR),
              prototypeId: data.id,
              createdBy: data.audit?.createdBy,
            },
          },
        })
      }
    >
      <Settings className="icon" fontSize="small" />
    </Button>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ArchiveMenuItem = () => (
    <MenuItem
      onClick={() => {
        handleClose();
        dispatch(
          openOverlayAction({
            type: OverlayNames.REASON_MODAL,
            props: {
              modalTitle: data?.archived ? 'Unarchive Checklist' : 'Archive Checklist',
              modalDesc: `Provide details for ${
                data?.archived ? 'unarchiving' : 'archiving'
              } the checklist`,
              onSubmitHandler: (reason: string, setFormErrors: (errors?: Error[]) => void) =>
                data?.archived
                  ? dispatch(unarchiveChecklist(data?.id, reason, setFormErrors))
                  : dispatch(archiveChecklist(data?.id, reason, setFormErrors)),
            },
          }),
        );
      }}
    >
      <div className="list-item">
        <MemoArchive />
        <span>{data?.archived ? 'Unarchive Checklist' : 'Archive Checklist'}</span>
      </div>
    </MenuItem>
  );

  const checkArchivePermission = () => {
    if (data?.global) {
      if (facilityId === ALL_FACILITY_ID) return true;
    } else if (checkPermission(['checklists', 'archive'])) {
      return true;
    }
    return false;
  };

  const MoreButton = () => (
    <>
      <Button
        id="more"
        variant="secondary"
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVert className="icon" fontSize="small" />
      </Button>
      <ListActionMenuButton
        style={{ right: 10 }}
        id="row-more-actions"
        anchorEl={anchorEl}
        keepMounted
        disableEnforceFocus
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(
              openOverlayAction({
                type: OverlayNames.CHECKLIST_INFO,
                props: { checklistId: data.id },
              }),
            );
          }}
        >
          <div className="list-item">
            <MemoViewInfo />
            <span>View Info</span>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate(`${data.id}/activities`);
          }}
        >
          <div className="list-item">
            <ActivityIcon />
            <span>View Activities</span>
          </div>
        </MenuItem>
        {facilityId !== ALL_FACILITY_ID && (
          <MenuItem onClick={() => navigate(`/checklists/${data?.id}/logs`)}>
            <div className="list-item">
              <MemoViewInfo />
              <span>View Job Logs</span>
            </div>
          </MenuItem>
        )}
        {data?.state === ChecklistStates.PUBLISHED || data?.audit?.createdBy?.archived
          ? checkArchivePermission() && <ArchiveMenuItem />
          : null}
      </ListActionMenuButton>
    </>
  );

  const AuthorSubmitButton = ({
    title,
    disabled = false,
  }: {
    title: string;
    disabled?: boolean;
  }) => (
    <Button
      disabled={disabled}
      className="submit"
      onClick={() => dispatch(validatePrototype(data.id))}
    >
      {title}
    </Button>
  );

  const InitiateSignOffButton = ({ title }: { title: string }) => (
    <Button className="submit" onClick={() => handleInitiateSignOff()}>
      {title}
    </Button>
  );

  const ViewReviewersButton = () => (
    <Button id="view-collaborators" variant="secondary" onClick={() => handleSubmitForReview(true)}>
      <Group className="icon" fontSize="small" />
    </Button>
  );

  const ViewSigningStateButton = () => (
    <Button
      variant="secondary"
      onClick={() => dispatch(openOverlayAction({ type: OverlayNames.SIGN_OFF_PROGRESS }))}
    >
      View Signing Status
    </Button>
  );

  const SignOffButton = () => (
    <Button
      className="submit"
      onClick={() => dispatch(openOverlayAction({ type: OverlayNames.PASSWORD_INPUT }))}
    >
      Sign
    </Button>
  );

  const renderButtonsForAuthor = () => {
    switch (data?.state) {
      case ChecklistStates.BEING_BUILT:
        return (
          <>
            {isPrimaryAuthor && (
              <AuthorSubmitButton disabled={!listOrder.length} title="Submit For Review" />
            )}
          </>
        );

      case ChecklistStates.SUBMITTED_FOR_REVIEW:
      case ChecklistStates.BEING_REVIEWED:
        return (
          <>
            <ViewReviewersButton />
          </>
        );

      case ChecklistStates.REQUESTED_CHANGES:
        return (
          <>
            <ViewReviewersButton />
            {isPrimaryAuthor && (
              <AuthorSubmitButton disabled={!listOrder.length} title="Submit For Review" />
            )}
          </>
        );

      case ChecklistStates.READY_FOR_SIGNING:
        return (
          <>
            <ViewReviewersButton />
            {isPrimaryAuthor && <InitiateSignOffButton title="Initiate Sign Off " />}
          </>
        );

      default:
        return (
          <>
            <ViewReviewersButton />
          </>
        );
    }
  };

  const checkReleasePermission = () => {
    if (data?.state === ChecklistStates.READY_FOR_RELEASE) {
      if (facilityId === ALL_FACILITY_ID) {
        return checkPermission(['checklists', 'releaseGlobal']);
      } else {
        return checkPermission(['checklists', 'release']);
      }
    }
    return false;
  };

  return (
    <HeaderWrapper>
      <div className="before-header">
        {headerNotification?.content && (
          <div className={`alert ${headerNotification.class || ''}`}>
            <Info />
            <span>{headerNotification.content}</span>
          </div>
        )}
      </div>
      <div className="main-header">
        <div className="drawer-toggle" onClick={() => dispatch(toggleIsDrawerOpen())}>
          <Menu />
        </div>
        <div className="header-content">
          <div className="header-content-left">
            <div className="checklist-name">{data?.name}</div>
            <div className="checklist-state">
              <FiberManualRecord
                className="icon"
                style={{ color: ChecklistStatesColors[data?.state] }}
              />
              <span>{ChecklistStatesContent[data?.state]}</span>
            </div>
          </div>

          <div className="header-content-right">
            {<PrototypeEditButton />}
            {author && !approver && renderButtonsForAuthor()}

            {reviewer && !approver && (
              <>
                <ViewReviewersButton />
                {data?.state !== ChecklistStates.REQUESTED_CHANGES &&
                data?.state !== ChecklistStates.BEING_BUILT
                  ? renderButtonsForReviewer(reviewer.state)
                  : null}
              </>
            )}
            {/* Note: We check only against the first value of the array as currently we support a user being assigned a single role only*/}
            {((approver && data?.state !== ChecklistStates.PUBLISHED) ||
              (!!(profile?.roles?.[0].id === RoleIdByName.CHECKLIST_PUBLISHER) &&
                data?.state === ChecklistStates.READY_FOR_RELEASE)) && (
              <>
                <ViewReviewersButton />
                <ViewSigningStateButton />
              </>
            )}
            {approver &&
              data?.state !== ChecklistStates.PUBLISHED &&
              approver?.state !== CollaboratorState.SIGNED && <SignOffButton />}
            {data?.state === ChecklistStates.PUBLISHED && null}
            {checkReleasePermission() && (
              <Button
                className="submit"
                onClick={() =>
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.PASSWORD_INPUT,
                      props: {
                        isReleasing: true,
                      },
                    }),
                  )
                }
              >
                Release Prototype
              </Button>
            )}
            <MoreButton />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default ChecklistHeader;
