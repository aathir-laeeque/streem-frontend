import { Button1 } from '#components';
import {
  closeAllOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  startChecklistReview,
  submitChecklistForReview,
} from '#Composer-new/reviewer.actions';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
} from '#Composer-new/reviewer.types';
import { useTypedSelector } from '#store';
import { FormMode } from '#views/Checklists/NewPrototype/types';
import {
  AddCircle,
  DoneAll,
  Settings,
  FiberManualRecord,
  Group,
  Info,
  Message,
  PlayCircleFilled,
  MoreHoriz,
} from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC } from 'react';
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

const ChecklistHeader: FC = () => {
  const dispatch = useDispatch();

  const { activeStageId, data, userId } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: state.prototypeComposer.data as Checklist,
    activeStageId: state.prototypeComposer.stages.activeStageId,
  }));

  const reviewer = data?.collaborators.filter(
    (reviewer) =>
      reviewer.reviewCycle === data.reviewCycle &&
      reviewer.type === CollaboratorType.REVIEWER &&
      reviewer.id === userId,
  )[0];

  const approver = data?.collaborators.filter(
    (reviewer) =>
      reviewer.reviewCycle === data.reviewCycle &&
      reviewer.type === CollaboratorType.APPROVER &&
      reviewer.id === userId,
  )[0];

  const author = data?.authors.filter((a) => a.id === userId)[0];

  let allDoneOk = true;
  data?.collaborators.forEach((r) => {
    if (
      r.reviewCycle === data.reviewCycle &&
      (r.state === CollaboratorState.ILLEGAL ||
        r.state === CollaboratorState.NOT_STARTED ||
        r.state === CollaboratorState.BEING_REVIEWED ||
        r.state === CollaboratorState.COMMENTED_CHANGES ||
        r.state === CollaboratorState.REQUESTED_CHANGES)
    ) {
      allDoneOk = false;
    }
  });

  const handleSubmitForReview = (isViewer = false, showAssignment = true) => {
    if (showAssignment) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.SUBMIT_REVIEW_MODAL,
          props: {
            isViewer,
            isAuthor: !!author,
            isPrimaryAuthor: author && author.primary,
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
          body: (
            <>Are you sure you want to start reviewing this Prototype now?</>
          ),
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
          reviewState: reviewer.state,
        },
      }),
    );
  };

  const renderButtonsForReviewer = (
    state: CollaboratorState,
    collaborators: Collaborator[],
  ) => {
    switch (state) {
      case CollaboratorState.NOT_STARTED:
        return (
          <Button1 className="submit" onClick={handleStartReview}>
            Start Review
          </Button1>
        );
      case CollaboratorState.BEING_REVIEWED:
        return (
          <Button1
            className="submit"
            onClick={() => handleSubmitForReview(false)}
          >
            Provide Review
          </Button1>
        );
      case CollaboratorState.COMMENTED_OK:
      case CollaboratorState.COMMENTED_CHANGES:
        const isReviewPending = collaborators.some(
          (r) =>
            r.state === CollaboratorState.BEING_REVIEWED ||
            r.state === CollaboratorState.NOT_STARTED,
        );

        return (
          <>
            {data?.status !== ChecklistStates.SIGNING_IN_PROGRESS && (
              <Button1
                className="submit"
                style={{ backgroundColor: '#333333' }}
                onClick={handleContinueReview}
              >
                <Message style={{ fontSize: '16px', marginRight: '8px' }} />
                Continue Review
              </Button1>
            )}
            {data?.status !== ChecklistStates.SIGNING_IN_PROGRESS &&
              !isReviewPending && (
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
              Are you sure you want to Initiate the Sing Off?
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
            mode: FormMode.EDIT,
            formData: {
              name: data.name,
              properties: data.properties,
              authors: data.authors,
              prototypeId: data.id,
            },
          },
        })
      }
    >
      <Settings className="icon" fontSize="small" />
    </Button1>
  );

  const MoreButton = () => (
    <Button1
      id="more"
      variant="secondary"
      onClick={() => console.log('MORE CLICKED')}
    >
      <MoreHoriz className="icon" fontSize="small" />
    </Button1>
  );

  const AuthorSubmitButton = ({ title }: { title: string }) => (
    <Button1
      className="submit"
      onClick={() =>
        data.status === ChecklistStates.BEING_BUILT
          ? dispatch(validatePrototype(data.id))
          : dispatch(submitChecklistForReview(data.id))
      }
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

  const ViewSigningStatusButton = () => (
    <Button1
      variant="secondary"
      onClick={() =>
        dispatch(openOverlayAction({ type: OverlayNames.SIGN_OFF_PROGRESS }))
      }
    >
      View Signing Status
    </Button1>
  );

  const SignOffButton = () => (
    <Button1
      className="submit"
      onClick={() =>
        dispatch(openOverlayAction({ type: OverlayNames.PASSWORD_INPUT }))
      }
    >
      Sign
    </Button1>
  );

  const renderButtonsForAuthor = () => {
    switch (data?.status) {
      case ChecklistStates.BEING_BUILT:
        return (
          <>
            {author.primary && (
              <>
                <PrototypeEditButton />
                <AuthorSubmitButton title="Submit For Review" />
                <MoreButton />
              </>
            )}
          </>
        );

      case ChecklistStates.SUBMITTED_FOR_REVIEW:
      case ChecklistStates.BEING_REVIEWED:
        return (
          <>
            <ViewReviewersButton />
            <MoreButton />
          </>
        );

      case ChecklistStates.REQUESTED_CHANGES:
        return (
          <>
            {author.primary && <PrototypeEditButton />}
            <ViewReviewersButton />
            {author.primary && <AuthorSubmitButton title="Submit For Review" />}
          </>
        );

      case ChecklistStates.READY_FOR_SIGNING:
        return (
          <>
            {author.primary && <PrototypeEditButton />}
            <ViewReviewersButton />
            {author.primary && (
              <InitiateSignOffButton title="Initiate Sign Off " />
            )}
          </>
        );

      case ChecklistStates.SIGN_OFF_INITIATED:
        return (
          <>
            <ViewReviewersButton />
            {author.primary && <ViewSigningStatusButton />}
            {approver && <SignOffButton />}
          </>
        );

      default:
        return (
          <>
            {author.primary && <PrototypeEditButton />}
            <ViewReviewersButton />
          </>
        );
    }
  };

  const disableAddingButtons = () =>
    data?.status === ChecklistStates.SUBMITTED_FOR_REVIEW ||
    data?.status === ChecklistStates.BEING_REVIEWED;

  return (
    <HeaderWrapper>
      <div className="before-header">
        {author && data?.status === ChecklistStates.SUBMITTED_FOR_REVIEW && (
          <div className="alert">
            <Info />
            <span>This Prototype has been sent to Reviewers</span>
          </div>
        )}
        {author && data?.status === ChecklistStates.READY_FOR_SIGNING && (
          <div
            className="alert"
            style={{
              backgroundColor: '#e1fec0',
              border: 'solid 1px #b2ef6c',
            }}
          >
            <Info style={{ color: '#427a00' }} />
            <span style={{ color: '#427a00' }}>
              All OK! No changes submitted by Reviewers
            </span>
          </div>
        )}
        {reviewer && reviewer.state === CollaboratorState.NOT_STARTED && (
          <div
            className="alert"
            style={{
              backgroundColor: '#eeeeee',
              border: 'solid 1px #bababa',
            }}
          >
            <Info style={{ color: '#000' }} />
            <span style={{ color: '#000' }}>
              Prototype Submitted for your Review
            </span>
          </div>
        )}
        {reviewer && reviewer.state === CollaboratorState.COMMENTED_CHANGES && (
          <div
            className="alert"
            style={{
              backgroundColor: 'rgba(247, 181, 0, 0.16)',
              border: 'solid 1px #f7b500',
            }}
          >
            <Info style={{ color: '#000' }} />
            <span style={{ color: '#000' }}>
              You have already submitted this checklist with comments
            </span>
          </div>
        )}
        {reviewer && reviewer.state === CollaboratorState.COMMENTED_OK && (
          <>
            {allDoneOk ? (
              <div
                className="alert"
                style={{
                  backgroundColor: '#e1fec0',
                  border: 'solid 1px #b2ef6c',
                }}
              >
                <Info style={{ color: '#427a00' }} />
                <span style={{ color: '#427a00' }}>
                  You and your team members have No Comments for changes
                </span>
              </div>
            ) : (
              <div className="alert">
                <Info />
                <span>
                  You have already reviewed this prototype and submitted it
                  without comments
                </span>
              </div>
            )}
          </>
        )}
        {reviewer &&
          (reviewer.state === CollaboratorState.REQUESTED_CHANGES ||
            reviewer.state === CollaboratorState.REQUESTED_NO_CHANGES) && (
            <div className="alert">
              <Info />
              <span>You have already submited your review to author.</span>
            </div>
          )}
      </div>
      <div className="main-header">
        <div className="header-content">
          <div className="header-content-left">
            <span className="checklist-name-label">Checklist Name</span>
            <div className="checklist-name">{data?.name}</div>
            <div className="checklist-status">
              <FiberManualRecord
                className="icon"
                style={{ color: ChecklistStatesColors[data?.status] }}
              />
              <span>{ChecklistStatesContent[data?.status]}</span>
            </div>
          </div>

          <div className="header-content-right">
            {author && renderButtonsForAuthor()}

            {reviewer && (
              <>
                <ViewReviewersButton />
                {data?.status !== ChecklistStates.REQUESTED_CHANGES &&
                data?.status !== ChecklistStates.BEING_BUILT
                  ? renderButtonsForReviewer(reviewer.state, data.collaborators)
                  : null}
              </>
            )}
          </div>
        </div>
        {author && (
          <div className="prototype-add-buttons">
            <Button1
              variant="textOnly"
              id="new-stage"
              disabled={disableAddingButtons()}
              onClick={() => dispatch(addNewStage())}
            >
              <AddCircle className="icon" fontSize="small" />
              Add a new Stage
            </Button1>

            <Button1
              variant="textOnly"
              id="new-task"
              disabled={disableAddingButtons()}
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

            <Button1
              variant="textOnly"
              id="preview"
              disabled={disableAddingButtons()}
            >
              <PlayCircleFilled className="icon" fontSize="small" />
              Preview
            </Button1>
          </div>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default ChecklistHeader;
