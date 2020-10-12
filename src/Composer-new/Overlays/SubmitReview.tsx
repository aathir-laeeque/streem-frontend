import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Avatar, BaseModal, Button1, Select } from '#components';
import React, { FC, useEffect, useState } from 'react';
import {
  Check,
  Message,
  FiberManualRecord,
  Person,
  Assignment,
  Create,
  PersonAdd,
} from '@material-ui/icons';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {
  CommonOverlayProps,
  OverlayNames,
} from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { Checklist } from '#Composer-new/checklist.types';
import { Reviewer } from '#Composer-new/reviewer.types';
import {
  submitChecklistReview,
  submitChecklistReviewWithCR,
} from '#Composer-new/reviewer.actions';
import { useDispatch } from 'react-redux';
import { groupBy } from 'lodash';
import { getOrdinal, removeUnderscore } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Wrapper, AntSwitch } from './SubmitReview.styles';
import {
  openOverlayAction,
  closeOverlayAction,
  updatePropsAction,
} from '#components/OverlayContainer/actions';
import { User } from '#store/users/types';

enum Options {
  OK = 'OK',
  COMMENTS = 'COMMENTS',
}

type Option = { label: string; value: string | null | number };

type InitialState = {
  selected: Options | null;
  editorState: any;
  contentBlock: any;
  selectedReviewer: null | number;
  selectedCycle: null | number;
  reviewCycleOptions: Option[];
  reviewersOptions: Option[];
};

const toolbarOptions = {
  options: ['inline', 'list'],
  inline: { options: ['bold', 'underline'] },
  list: { options: ['unordered'] },
};

const initialState: InitialState = {
  selected: null,
  editorState: EditorState.createEmpty(),
  contentBlock: htmlToDraft(''),
  selectedReviewer: null,
  selectedCycle: null,
  reviewCycleOptions: [{ label: 'All', value: null }],
  reviewersOptions: [{ label: 'All', value: null }],
};

export const SubmitReviewModal: FC<CommonOverlayProps<{
  isViewer: boolean;
  sendToAuthor: boolean;
  isAuthor: boolean;
}>> = ({ closeAllOverlays, closeOverlay, props }) => {
  const isViewer = props?.isViewer || false;
  const isAuthor = props?.isAuthor || false;

  const sendToAuthor = props?.sendToAuthor || false;
  const dispatch = useDispatch();
  const { userId } = useTypedSelector((state) => state.auth);
  let { data } = useTypedSelector((state) => state.prototypeComposer);
  data = data as Checklist;

  const [state, setState] = useState(initialState);

  useEffect(() => {
    let editorState = EditorState.createEmpty();
    if (state.contentBlock) {
      const commentExist = (data as Checklist).comments.filter(
        (c) =>
          c.commentedBy.id === userId &&
          c.reviewCycle === (data as Checklist).reviewCycle,
      );

      if (commentExist.length > 0) {
        const content = htmlToDraft(commentExist[0].comments);
        const contentState = ContentState.createFromBlockArray(
          content.contentBlocks,
        );

        editorState = EditorState.createWithContent(contentState);
      }
    }

    const reviewerOptions = (data as Checklist).reviewers.map((r) => ({
      label: `${r.firstName} ${r.lastName} - ${r.employeeId}`,
      value: r.id,
    }));

    const cycleOptions = [];
    for (let i = 1; i <= (data as Checklist).reviewCycle; i++) {
      cycleOptions.push({ label: getOrdinal(i), value: i });
    }

    setState({
      ...state,
      editorState,
      reviewersOptions: [...state.reviewersOptions, ...reviewerOptions],
      reviewCycleOptions: [...state.reviewCycleOptions, ...cycleOptions],
    });
  }, []);

  const handleOnAllOK = () => {
    if (data && data.id) dispatch(submitChecklistReview(data?.id));
  };

  const handleOnCompleteWithCR = () => {
    const comments = draftToHtml(
      convertToRaw(state.editorState.getCurrentContent()),
    );
    if (data && data.id)
      dispatch(submitChecklistReviewWithCR(data?.id, comments));
  };

  const groupedComments = groupBy(data?.comments, 'reviewCycle');
  const comments: any = [];
  Object.keys(groupedComments).forEach((item) => {
    let shouldInculde = true;
    let shouldInculdeUser = true;
    if (state.selectedCycle) {
      shouldInculde = state.selectedCycle === Number(item);
    }
    if (state.selectedReviewer) {
      shouldInculdeUser = false;
    }
    if (shouldInculde)
      comments.push(
        <div className="reviews-group" key={`reviewerGroup_${item}`}>
          <span>{`${getOrdinal(Number(item))} Review`}</span>
          <div className="comments-group">
            {groupedComments[item].map((comment) => {
              if (
                !shouldInculdeUser &&
                state.selectedReviewer !== comment.commentedBy.id
              )
                return null;
              return (
                <div className="comment-section" key={`comment_${comment.id}`}>
                  <div className="user-detail">
                    <div>
                      <Avatar user={comment.commentedBy} />
                      <h4>{`${comment.commentedBy.firstName} ${comment.commentedBy.lastName},`}</h4>
                      <h5>{`ID : ${comment.commentedBy.employeeId}`}</h5>
                    </div>
                    <div>
                      <span>
                        {formatDateTime(
                          comment.commentedAt,
                          'Do MMM, YYYY, HH:MM a',
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    className="comment"
                    dangerouslySetInnerHTML={{ __html: comment.comments }}
                  />
                </div>
              );
            })}
          </div>
        </div>,
      );
  });

  const handleAuthorMouseOver = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    users: User,
  ) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.AUTHORS_DETAIL,
        popOverAnchorEl: event.currentTarget,
        props: {
          users,
        },
      }),
    );
  };

  const toggleSendToAuthor = () => {
    dispatch(
      updatePropsAction(OverlayNames.SUBMIT_REVIEW_MODAL, {
        sendToAuthor: !sendToAuthor,
        isViewer: true,
      }),
    );
  };

  const handleReviewersMouseOver = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    users: Reviewer[],
  ) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.REVIEWERS_DETAIL,
        popOverAnchorEl: event.currentTarget,
        props: {
          users,
        },
      }),
    );
  };

  const handleAssignReviewers = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER,
        popOverAnchorEl: event.currentTarget,
        props: {
          checklistId: (data as Checklist).id,
        },
      }),
    );
  };

  return (
    <Wrapper comments={isViewer || state.selected === Options.COMMENTS}>
      <BaseModal
        showFooter={false}
        showHeader={false}
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title=""
      >
        {sendToAuthor && (
          <>
            <div className="box-wrapper">
              <div className="box">
                <div
                  className="icon-wrapper"
                  style={{ backgroundColor: '#dadada' }}
                >
                  <Create style={{ color: '#000000', fontSize: '40px' }} />
                </div>
                <h3>Send to Author</h3>
                <span>Requesting for some Modification</span>
              </div>
            </div>
            <Button1 className="submit" onClick={handleOnAllOK}>
              Confirm
            </Button1>
            <Button1 variant="textOnly" onClick={toggleSendToAuthor}>
              View Requested Changes
            </Button1>
          </>
        )}

        {!sendToAuthor && !isViewer && state.selected === null && (
          <>
            <div className="box-wrapper">
              <div
                className="box"
                onClick={() => setState({ ...state, selected: Options.OK })}
              >
                <div
                  className="icon-wrapper"
                  style={{ backgroundColor: '#e1fec0' }}
                >
                  <Check style={{ color: '#427a00', fontSize: '40px' }} />
                </div>
                <h3>All OK</h3>
                <span>No Comments Needed</span>
              </div>
              <div
                className="box"
                onClick={() =>
                  setState({ ...state, selected: Options.COMMENTS })
                }
              >
                <div
                  className="icon-wrapper"
                  style={{ backgroundColor: '#eeeeee' }}
                >
                  <Message style={{ color: '#000', fontSize: '40px' }} />
                </div>
                <h3>Needs Commenting</h3>
                <span>Some Changes are Necessary</span>
              </div>
            </div>
            <span className="caption">Choose any one option to proceed</span>
          </>
        )}

        {!sendToAuthor && !isViewer && state.selected === Options.OK && (
          <>
            <div className="box-wrapper">
              <div className="box">
                <div
                  className="icon-wrapper"
                  style={{ backgroundColor: '#e1fec0' }}
                >
                  <Check style={{ color: '#427a00', fontSize: '40px' }} />
                </div>
                <h3>All OK</h3>
                <span>No Comments Needed</span>
              </div>
            </div>
            <Button1 className="submit" onClick={handleOnAllOK}>
              Confirm
            </Button1>
            <Button1
              variant="textOnly"
              onClick={() => setState({ ...state, selected: null })}
            >
              Go Back
            </Button1>
          </>
        )}

        {(!sendToAuthor && isViewer) || state.selected === Options.COMMENTS ? (
          <>
            <div className="header">
              <div className="header-left">
                <h5>Checklist Name</h5>
                <h4>{data?.name}</h4>
                <h6>
                  <FiberManualRecord className="icon" />
                  {removeUnderscore(data?.status.toLowerCase())}
                </h6>
              </div>
              <div className="header-right">
                {!isAuthor && (
                  <>
                    <AntSwitch
                      checked={!state.selectedReviewer}
                      onChange={() => {
                        if (!state.selectedReviewer) {
                          setState({ ...state, selectedReviewer: userId });
                        } else {
                          setState({ ...state, selectedReviewer: null });
                        }
                      }}
                      name="showAllComments"
                    />
                    <h6>All Comments</h6>
                  </>
                )}
                <div
                  className="icon-wrapper"
                  aria-haspopup="true"
                  onMouseEnter={(e) =>
                    handleAuthorMouseOver(e, (data as Checklist).authors)
                  }
                  onMouseLeave={() =>
                    dispatch(closeOverlayAction(OverlayNames.AUTHORS_DETAIL))
                  }
                >
                  <Assignment
                    style={{
                      fontSize: '8px',
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                    }}
                  />
                  <Person style={{ fontSize: '18px' }} />
                </div>
                <div
                  className="icon-wrapper"
                  aria-haspopup="true"
                  onMouseEnter={(e) =>
                    handleReviewersMouseOver(e, (data as Checklist).reviewers)
                  }
                  onMouseLeave={() =>
                    dispatch(closeOverlayAction(OverlayNames.REVIEWERS_DETAIL))
                  }
                >
                  <Message
                    style={{
                      fontSize: '8px',
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                    }}
                  />
                  <Person style={{ fontSize: '18px' }} />
                </div>
                {isAuthor && (
                  <div
                    className="icon-wrapper"
                    style={{
                      borderRadius: '4px',
                      borderColor: '#1d84ff',
                    }}
                    aria-haspopup="true"
                    onClick={(e) => handleAssignReviewers(e)}
                  >
                    <PersonAdd style={{ fontSize: '18px' }} />
                  </div>
                )}
              </div>
            </div>
            <div className="body">
              {!isViewer && (
                <div className="box">
                  <Editor
                    editorState={state.editorState}
                    wrapperClassName="editor-wrapper"
                    editorClassName="editor"
                    toolbarClassName="editor-toolbar"
                    toolbar={toolbarOptions}
                    onEditorStateChange={(editorState: any) =>
                      setState({ ...state, editorState })
                    }
                  />
                  <div className="actions-container">
                    <Button1
                      color="red"
                      variant="secondary"
                      onClick={() => setState({ ...state, selected: null })}
                    >
                      Cancel
                    </Button1>
                    <Button1 onClick={handleOnCompleteWithCR}>Confirm</Button1>
                  </div>
                </div>
              )}
              <div className="box">
                <div className="filter-input">
                  <div>
                    <h6>Filter Comments by Reviewers</h6>
                    <Select
                      options={state.reviewersOptions}
                      onChange={(option) => {
                        setState({ ...state, selectedReviewer: option.value });
                      }}
                      placeHolder="All"
                      persistValue={true}
                    />
                  </div>
                  <div>
                    <h6>Filter Comments by Review Cycle</h6>
                    <Select
                      options={state.reviewCycleOptions}
                      onChange={(option) => {
                        setState({ ...state, selectedCycle: option.value });
                      }}
                      placeHolder="All"
                      persistValue={true}
                    />
                  </div>
                </div>
                <div className="comments-section">{comments}</div>
              </div>
            </div>
          </>
        ) : null}
      </BaseModal>
    </Wrapper>
  );
};
