import ActivityIcon from '#assets/svg/ActivityIcon';
import MemoArchive from '#assets/svg/Archive';
import MemoViewInfo from '#assets/svg/ViewInfo';
import { Button1 } from '#components';
import { closeAllOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  startChecklistReview,
  submitChecklistForReview,
} from '#PrototypeComposer/reviewer.actions';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
} from '#PrototypeComposer/reviewer.types';
import checkPermission, { RoleIdByName } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { ALL_FACILITY_ID } from '#utils/constants';
import { Error } from '#utils/globalTypes';
import { archiveChecklist, unarchiveChecklist } from '#views/Checklists/ListView/actions';
import { FormMode } from '#views/Checklists/NewPrototype/types';
import { Menu, MenuItem } from '@material-ui/core';
import {
  AddCircle,
  DoneAll,
  FiberManualRecord,
  Group,
  Info,
  Message,
  MoreVert,
  Settings,
} from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { validatePrototype } from '../actions';
import {
  Checklist,
  ChecklistStates,
  ChecklistStatesColors,
  ChecklistStatesContent,
} from '../checklist.types';
import { addNewStage } from '../Stages/actions';
import { addNewTask } from '../Tasks/actions';
import HeaderWrapper from './styles';

type InitialState = {
  isPrimaryAuthor: boolean;
  allDoneOk: boolean;
  areReviewsPending: boolean;
  reviewer: null | Collaborator;
  author: null | Collaborator;
  approver: null | Collaborator;
  headerNotification: {
    content?: string;
    class?: string;
  };
};

const initialState: InitialState = {
  isPrimaryAuthor: false,
  allDoneOk: true,
  areReviewsPending: false,
  reviewer: null,
  author: null,
  approver: null,
  headerNotification: {},
};

const ChecklistHeader: FC = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [state, setState] = useState(initialState);

  const {
    activeStageId,
    data,
    userId,
    listOrder,
    profile,
    selectedFacility: { id: facilityId = '' } = {},
  } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: state.prototypeComposer.data as Checklist,
    activeStageId: state.prototypeComposer.stages.activeStageId,
    listOrder: state.prototypeComposer.stages.listOrder,
    profile: state.auth.profile,
    selectedFacility: state.auth.selectedFacility,
  }));

  useEffect(() => {
    const newState = (data?.collaborators || []).reduce(
      (acc, collaborator) => {
        if (collaborator.type === CollaboratorType.REVIEWER && collaborator.phase === data.phase) {
          // Rather Than Comparing with all Invalid States, Its better to neglect the valid as invalid states are more.
          if (
            collaborator.state in CollaboratorState &&
            collaborator.state !== CollaboratorState.COMMENTED_OK &&
            collaborator.state !== CollaboratorState.REQUESTED_NO_CHANGES &&
            collaborator.state !== CollaboratorState.SIGNED
          ) {
            acc.allDoneOk = false;
          }

          if (
            collaborator.state === CollaboratorState.NOT_STARTED ||
            collaborator.state === CollaboratorState.BEING_REVIEWED
          ) {
            acc.areReviewsPending = true;
          }
        }
        if (collaborator.id === userId) {
          switch (collaborator.type) {
            case CollaboratorType.PRIMARY_AUTHOR:
            case CollaboratorType.AUTHOR:
              acc.author = collaborator;

              if (collaborator.type === CollaboratorType.PRIMARY_AUTHOR) acc.isPrimaryAuthor = true;

              switch (data.state) {
                case ChecklistStates.SUBMITTED_FOR_REVIEW:
                  acc.headerNotification = {
                    content: 'This Prototype has been sent to Reviewers',
                  };
                  break;
                case ChecklistStates.READY_FOR_SIGNING:
                  acc.headerNotification = {
                    content: 'All OK! No changes submitted by Reviewers',
                    class: 'success',
                  };
                  break;
              }

              break;
            case CollaboratorType.REVIEWER:
              if (collaborator.phase === data.phase) {
                acc.reviewer = collaborator;

                if (data.state === ChecklistStates.READY_FOR_SIGNING) {
                  acc.headerNotification = {
                    content: 'Author has to start the signing process',
                    class: 'success',
                  };
                } else if (data.state !== ChecklistStates.READY_FOR_RELEASE) {
                  if (collaborator.state === CollaboratorState.NOT_STARTED) {
                    acc.headerNotification = {
                      content: 'Prototype Submitted for your Review',
                      class: 'secondary',
                    };
                  } else if (collaborator.state === CollaboratorState.COMMENTED_CHANGES) {
                    acc.headerNotification = {
                      content: 'You have already submitted this checklist with comments',
                      class: 'secondary',
                    };
                  } else if (collaborator.state === CollaboratorState.COMMENTED_OK) {
                    if (acc.allDoneOk) {
                      acc.headerNotification = {
                        content: 'You and your team members have No Comments for changes',
                        class: 'success',
                      };
                    } else {
                      acc.headerNotification = {
                        content:
                          'You have already reviewed this prototype and submitted it without comments',
                      };
                    }
                  } else if (
                    data.state !== ChecklistStates.SIGN_OFF_INITIATED &&
                    data.state !== ChecklistStates.BEING_REVIEWED &&
                    data.state !== ChecklistStates.PUBLISHED
                  ) {
                    acc.headerNotification = {
                      content: 'You have already submitted your review to author.',
                    };
                  }
                }
              }
              break;
            case CollaboratorType.SIGN_OFF_USER:
              if (!acc.approver || collaborator.state === CollaboratorState.NOT_STARTED) {
                acc.approver = collaborator;
              }
              break;
          }
        }

        if (data.state === ChecklistStates.READY_FOR_RELEASE) {
          acc.headerNotification = {
            content: 'Checklist is Ready for Release',
            class: 'success',
          };
        }

        return acc;
      },
      { ...initialState },
    );

    setState(newState);
  }, [data?.collaborators, data?.state]);

  const {
    isPrimaryAuthor,
    allDoneOk,
    areReviewsPending,
    reviewer,
    author,
    approver,
    headerNotification,
  } = state;

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
            <Button1 className="submit" onClick={handleStartReview}>
              Start Review
            </Button1>
          </>
        );
      case CollaboratorState.BEING_REVIEWED:
        return (
          <>
            <Button1 className="submit" onClick={() => handleSubmitForReview(false)}>
              Provide Review
            </Button1>
          </>
        );
      case CollaboratorState.COMMENTED_OK:
      case CollaboratorState.COMMENTED_CHANGES:
        return (
          <>
            {data?.state !== ChecklistStates.SIGNING_IN_PROGRESS && (
              <Button1
                className="submit"
                style={{ backgroundColor: '#333333' }}
                onClick={handleContinueReview}
              >
                <Message style={{ fontSize: '16px', marginRight: '8px' }} />
                Continue Review
              </Button1>
            )}
            {data?.state !== ChecklistStates.SIGNING_IN_PROGRESS && !areReviewsPending && (
              <Button1
                color={allDoneOk ? 'green' : 'blue'}
                className="submit"
                onClick={handleSendToAuthor}
              >
                <DoneAll style={{ fontSize: '16px', marginRight: '8px' }} />
                Send to Author
              </Button1>
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
    <Button1
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
    </Button1>
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
              onSumbitHandler: (reason: string, setFormErrors: (errors?: Error[]) => void) =>
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

  const MoreButton = () => (
    <>
      <Button1
        id="more"
        variant="secondary"
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVert className="icon" fontSize="small" />
      </Button1>
      <Menu
        style={{ right: 10 }}
        id="row-more-actions"
        className="header-more-actions"
        anchorEl={anchorEl}
        keepMounted
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
            navigate(`${data.id}/activites`);
          }}
        >
          <div className="list-item">
            <ActivityIcon />
            <span>View Activities</span>
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/checklists/${data?.id}/logs`)}>
          <div className="list-item">
            <MemoViewInfo />
            <span>View Job Logs</span>
          </div>
        </MenuItem>
        {data?.state === ChecklistStates.PUBLISHED || data?.audit?.createdBy?.archived ? (
          checkPermission(['checklists', 'archive']) ? (
            <ArchiveMenuItem />
          ) : null
        ) : data?.audit?.createdBy?.id === userId ? (
          <ArchiveMenuItem />
        ) : null}
      </Menu>
    </>
  );

  const AuthorSubmitButton = ({
    title,
    disabled = false,
  }: {
    title: string;
    disabled?: boolean;
  }) => (
    <Button1
      disabled={disabled}
      className="submit"
      onClick={() => dispatch(validatePrototype(data.id))}
    >
      {title}
    </Button1>
  );

  const InitiateSignOffButton = ({ title }: { title: string }) => (
    <Button1 className="submit" onClick={() => handleInitiateSignOff()}>
      {title}
    </Button1>
  );

  const ViewReviewersButton = () => (
    <Button1
      id="view-collaborators"
      variant="secondary"
      onClick={() => handleSubmitForReview(true)}
    >
      <Group className="icon" fontSize="small" />
    </Button1>
  );

  const ViewSigningStateButton = () => (
    <Button1
      variant="secondary"
      onClick={() => dispatch(openOverlayAction({ type: OverlayNames.SIGN_OFF_PROGRESS }))}
    >
      View Signing Status
    </Button1>
  );

  const SignOffButton = () => (
    <Button1
      className="submit"
      onClick={() => dispatch(openOverlayAction({ type: OverlayNames.PASSWORD_INPUT }))}
    >
      Sign
    </Button1>
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
              <Button1
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
              </Button1>
            )}
            <MoreButton />
          </div>
        </div>
        {author &&
          (data?.state === ChecklistStates.BEING_BUILT ||
            data?.state === ChecklistStates.REQUESTED_CHANGES) && (
            <div className="prototype-add-buttons">
              <Button1 variant="textOnly" id="new-stage" onClick={() => dispatch(addNewStage())}>
                <AddCircle className="icon" fontSize="small" />
                Add a new Stage
              </Button1>

              <Button1
                variant="textOnly"
                id="new-task"
                onClick={() => {
                  if (activeStageId) {
                    dispatch(
                      addNewTask({
                        checklistId: data.id,
                        stageId: activeStageId,
                      }),
                    );
                  }
                }}
              >
                <AddCircle className="icon" fontSize="small" />
                Add a new Task
              </Button1>

              <div id="preview" />
            </div>
          )}
      </div>
    </HeaderWrapper>
  );
};

export default ChecklistHeader;
