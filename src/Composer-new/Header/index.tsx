import { Button1 } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  continueChecklistReview,
  startChecklistReview,
} from '#Composer-new/reviewer.actions';
import { Reviewer, ReviewerState } from '#Composer-new/reviewer.types';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { removeUnderscore } from '#utils/stringUtils';
import {
  AddCircle,
  DoneAll,
  Edit,
  FiberManualRecord,
  Group,
  Info,
  Message,
  PlayCircleFilled,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { Checklist, ChecklistStates } from '../checklist.types';
import { addNewStage } from '../Stages/actions';
import { addNewTask } from '../Tasks/actions';
import HeaderWrapper from './styles';

const JobHeader: FC = () => {
  return <HeaderWrapper>Composer Header for Job Entity</HeaderWrapper>;
};

const ChecklistHeader: FC = () => {
  const dispatch = useDispatch();

  const { activeStageId, data, userId } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: state.prototypeComposer.data as Checklist,
    activeStageId: state.prototypeComposer.stages.activeStageId,
  }));

  const handleSubmit = () => {
    if (data && data.id)
      dispatch(
        openOverlayAction({
          type: OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT,
          props: {
            checklistId: data.id,
          },
        }),
      );
  };

  const reviewer = data?.reviewers.filter(
    (reviewer) => reviewer.id === userId,
  )[0];

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
            <>Are you sure you want to start reviewing this checkcklist now ?</>
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
    state: ReviewerState,
    reviewers: Reviewer[],
  ) => {
    switch (state) {
      case ReviewerState.NOT_STARTED:
        return (
          <Button1 className="submit" onClick={handleStartReview}>
            Start
          </Button1>
        );
      case ReviewerState.IN_PROGRESS:
        return (
          <Button1
            className="submit"
            onClick={() => handleSubmitForReview(false)}
          >
            Submit
          </Button1>
        );
      case ReviewerState.DONE:
      case ReviewerState.DONE_WITH_CR:
        const isReviewPending = reviewers.some(
          (r) =>
            r.state === ReviewerState.IN_PROGRESS ||
            r.state === ReviewerState.NOT_STARTED,
        );

        return (
          <>
            <Button1
              className="submit"
              style={{ backgroundColor: '#333333' }}
              onClick={handleContinueReview}
            >
              <Message style={{ fontSize: '16px', marginRight: '8px' }} />
              Continue Review
            </Button1>
            {!isReviewPending && (
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

  return (
    <HeaderWrapper>
      <div className="before-header">
        {!reviewer && data.status === ChecklistStates.BEING_REVIEWED && (
          <div className="alert">
            <Info />
            <span>This Prototype has been sent to Reviewers</span>
          </div>
        )}
        {reviewer && reviewer.state === ReviewerState.DONE && (
          <div className="alert">
            <Info />
            <span>
              You have already reviewed this checklist and submitted it without
              comments
            </span>
          </div>
        )}
        {reviewer && reviewer.state === ReviewerState.DONE_WITH_CR && (
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
      </div>
      <div className="header-content">
        <div className="header-content-left">
          <span className="checklist-name-label">Checklist Name</span>
          <div className="checklist-name">{data?.name}</div>
          <div className="checklist-status">
            Configuration Status :<FiberManualRecord className="icon" />
            {removeUnderscore(data?.status.toLowerCase())}
          </div>
        </div>

        <div className="header-content-right">
          <Button1 id="edit" variant="secondary">
            <Edit className="icon" fontSize="small" />
          </Button1>

          <Button1
            id="view-reviewers"
            variant="secondary"
            onClick={() => handleSubmitForReview(true)}
          >
            <Group className="icon" fontSize="small" />
          </Button1>

          {reviewer ? (
            renderButtonsForReviewer(reviewer.state, data.reviewers)
          ) : data.status === ChecklistStates.IN_PROGRESS ||
            data.status === ChecklistStates.DRAFT ? (
            <Button1 className="submit" onClick={handleSubmit}>
              Submit
            </Button1>
          ) : null}
        </div>
      </div>

      <div className="prototype-add-buttons">
        <Button1
          variant="textOnly"
          id="new-stage"
          onClick={() => dispatch(addNewStage())}
        >
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

        <Button1 variant="textOnly" id="preview">
          <PlayCircleFilled className="icon" fontSize="small" />
          Preview
        </Button1>
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
