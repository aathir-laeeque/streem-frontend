import { Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  continueChecklistReview,
  startChecklistReview,
} from '#Composer-new/reviewer.actions';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
} from '#Composer-new/reviewer.types';
import { ComposerEntity } from '#Composer-new/types';
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
  ChecklistStatesContent,
} from '../checklist.types';
import { addNewStage } from '../Stages/actions';
import { addNewTask } from '../Tasks/actions';
import HeaderWrapper from './styles';

const JobHeader: FC = () => {
  const status = useTypedSelector(
    (state) => (state.prototypeComposer.data as Checklist)?.status,
  );

  return (
    <HeaderWrapper checklistState={status}>
      Composer Header for Job Entity
    </HeaderWrapper>
  );
};

const ChecklistHeader: FC = () => {
  const dispatch = useDispatch();

  const { activeStageId, data, status, userId } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: state.prototypeComposer.data as Checklist,
    activeStageId: state.prototypeComposer.stages.activeStageId,
    status: (state.prototypeComposer.data as Checklist).status,
  }));

  const reviewer = data?.collaborators.filter(
    (reviewer) =>
      reviewer.type === CollaboratorType.REVIEWER && reviewer.id === userId,
  )[0];

  const author = data?.authors.filter((a) => a.id === userId)[0];

  const handleSubmitForReview = (isViewer = false) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.SUBMIT_REVIEW_MODAL,
        props: {
          isViewer,
          isAuthor: !reviewer,
        },
      }),
    );
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

  const onContinueReview = () => {
    if (data && data.id) dispatch(continueChecklistReview(data?.id));
  };

  const handleContinueReview = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          onPrimary: () => onContinueReview(),
          primaryText: 'Confirm',
          title: 'Continue Review',
          body: (
            <>
              Are you sure you want to continue reviewing ? You will have to
              once again submit to end your review.
            </>
          ),
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
            {data.status !== ChecklistStates.SIGNING_IN_PROGRESS && (
              <Button1
                className="submit"
                style={{ backgroundColor: '#333333' }}
                onClick={handleContinueReview}
              >
                <Message style={{ fontSize: '16px', marginRight: '8px' }} />
                Continue Review
              </Button1>
            )}
            {data.status !== ChecklistStates.SIGNING_IN_PROGRESS &&
              !isReviewPending && (
                <Button1 className="submit" onClick={handleSendToAuthor}>
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
      onClick={() => dispatch(validatePrototype(data.id))}
    >
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

  const renderButtonsForAuthor = () => {
    switch (data.status) {
      case ChecklistStates.BEING_BUILT:
        return (
          <>
            <PrototypeEditButton />
            {author.primary && <AuthorSubmitButton title="Submit For Review" />}
            <MoreButton />
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
            <PrototypeEditButton />
            <ViewReviewersButton />
            <AuthorSubmitButton title="Submit" />
          </>
        );

      default:
        return (
          <>
            <PrototypeEditButton />
            <ViewReviewersButton />
          </>
        );
    }
  };

  return (
    <HeaderWrapper checklistState={status}>
      <div className="before-header">
        {author && data.status === ChecklistStates.SUBMITTED_FOR_REVIEW && (
          <div className="alert">
            <Info />
            <span>This Prototype has been sent to Reviewers</span>
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
          <div className="alert">
            <Info />
            <span>
              You have already reviewed this prototype and submitted it without
              comments
            </span>
          </div>
        )}
      </div>
      <div className="main-header">
        <div className="header-content">
          <div className="header-content-left">
            <span className="checklist-name-label">Checklist Name</span>
            <div className="checklist-name">{data?.name}</div>
            <div className="checklist-status">
              <FiberManualRecord className="icon" />
              <span>{ChecklistStatesContent[data?.status]}</span>
            </div>
          </div>

          <div className="header-content-right">
            {author && renderButtonsForAuthor()}

            {reviewer && (
              <>
                <ViewReviewersButton />
                {data.status !== ChecklistStates.REQUESTED_CHANGES &&
                data.status !== ChecklistStates.BEING_BUILT
                  ? renderButtonsForReviewer(reviewer.state, data.collaborators)
                  : null}
              </>
            )}
          </div>
        </div>

        <div className="prototype-add-buttons">
          <Button1
            variant="textOnly"
            id="new-stage"
            disabled={
              data.status === ChecklistStates.SUBMITTED_FOR_REVIEW ||
              data.status === ChecklistStates.BEING_REVIEWED
            }
            onClick={() => dispatch(addNewStage())}
          >
            <AddCircle className="icon" fontSize="small" />
            Add a new Stage
          </Button1>

          <Button1
            variant="textOnly"
            id="new-task"
            disabled={
              data.status === ChecklistStates.SUBMITTED_FOR_REVIEW ||
              data.status === ChecklistStates.BEING_REVIEWED
            }
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

          <Button1 variant="textOnly" id="preview">
            <PlayCircleFilled className="icon" fontSize="small" />
            Preview
          </Button1>
        </div>
      </div>
    </HeaderWrapper>
  );
};

const Header: FC = () => {
  const { entity } = useTypedSelector((state) => state.prototypeComposer);

  if (entity === ComposerEntity.CHECKLIST) {
    return <ChecklistHeader />;
  } else {
    return <JobHeader />;
  }
};

export default Header;
