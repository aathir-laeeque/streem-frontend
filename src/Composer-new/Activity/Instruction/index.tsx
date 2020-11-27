import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { FC, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';
import { useDispatch } from 'react-redux';
import { updateActivity } from '../actions';
import { emojis } from '#utils/constants';

const toolbarOptions = {
  options: ['inline', 'list', 'emoji'],
  inline: { options: ['bold', 'underline'] },
  list: { options: ['unordered', 'ordered'] },
  emoji: {
    emojis,
  },
};

const InstructionActivity: FC<Omit<ActivityProps, 'taskId'>> = ({
  activity,
}) => {
  const dispatch = useDispatch();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentBlock, setContentBlock] = useState(
    htmlToDraft(activity.data.text),
  );

  const activityError = activity.errors.find((error) => error.code === 'E422');

  useEffect(() => {
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
      );

      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [contentBlock]);

  useEffect(() => {
    setContentBlock(htmlToDraft(activity.data.text));
  }, [activity]);

  return (
    <Wrapper>
      <div className="activity-header">Write your instruction/notes</div>

      <Editor
        editorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={toolbarOptions}
        onBlur={() => {
          const value = draftToHtml(
            convertToRaw(editorState.getCurrentContent()),
          );

          dispatch(updateActivity({ ...activity, data: { text: value } }));
        }}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
      />

      {activityError ? (
        <div className="activity-error">{activityError?.message}</div>
      ) : null}
    </Wrapper>
  );
};

export default InstructionActivity;
