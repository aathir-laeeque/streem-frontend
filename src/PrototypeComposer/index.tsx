import { StyledTabs } from '#components';
import {
  Collaborator,
  CollaboratorState,
  CollaboratorType,
} from '#PrototypeComposer/reviewer.types';
import { useTypedSelector } from '#store';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchComposerData, resetComposer } from './actions';
import { ChecklistStates, EnabledStates } from './checklist.types';
import Header from './Header';
import Stages from './Stages';
import { ComposerWrapper, TasksTabWrapper } from './styles';
import Tasks from './Tasks';
import AddParameter from './Tasks/AddParameter';
import ParametersList from './Parameters/ListView';
import BranchingRules from './BranchingRules';
import { ComposerProps } from './types';

export type ProcessInitialState = {
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

const initialState: ProcessInitialState = {
  isPrimaryAuthor: false,
  allDoneOk: true,
  areReviewsPending: false,
  reviewer: null,
  author: null,
  approver: null,
  headerNotification: {},
};

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const {
    userId,
    prototypeComposer: { loading, data },
  } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    prototypeComposer: state.prototypeComposer,
  }));

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity, id }));
    }

    return () => {
      dispatch(resetComposer());
    };
  }, [id]);

  useEffect(() => {
    if (data) {
      const newState = (data?.collaborators || []).reduce(
        (acc, collaborator) => {
          if (
            collaborator.type === CollaboratorType.REVIEWER &&
            collaborator.phase === data.phase
          ) {
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

                if (collaborator.type === CollaboratorType.PRIMARY_AUTHOR)
                  acc.isPrimaryAuthor = true;

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
    }
  }, [data?.collaborators, data?.state]);

  const { author } = state;

  const isNotReadOnly = author && (data?.archived || (data?.state || '') in EnabledStates);

  return (
    <LoadingContainer
      loading={loading}
      component={
        <>
          <ComposerWrapper>
            <Header {...state} />
            <StyledTabs
              containerProps={{
                className: 'process-tabs',
              }}
              tabListProps={{
                className: 'process-tabs-list',
              }}
              panelsProps={{
                className: 'process-tabs-panel',
              }}
              tabs={[
                {
                  value: '0',
                  label: 'Tasks',
                  panelContent: (
                    <TasksTabWrapper>
                      <Stages isReadOnly={!isNotReadOnly} />
                      <Tasks isReadOnly={!isNotReadOnly} />
                    </TasksTabWrapper>
                  ),
                },
                {
                  value: '1',
                  label: 'Parameters',
                  panelContent: <ParametersList isReadOnly={!isNotReadOnly} />,
                },
                {
                  value: '2',
                  label: 'Branching Rules',
                  panelContent: <BranchingRules isReadOnly={!isNotReadOnly} />,
                },
                // {
                //   value: '3',
                //   label: 'Verifiers',
                //   panelContent: <div>Verifiers</div>,
                // },
                // {
                //   value: '4',
                //   label: 'Automation',
                //   panelContent: <div>Automation</div>,
                // },
              ]}
            />
            {data && data.state && <AddParameter isReadOnly={!isNotReadOnly} />}
          </ComposerWrapper>
        </>
      }
    />
  );
};

export default Composer;
