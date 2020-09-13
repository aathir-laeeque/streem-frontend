import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import CheckCircle from '#assets/svg/CheckCircle';
import Danger from '#assets/svg/Danger';
import Delete from '#assets/svg/Delete';
import Electricity from '#assets/svg/Electricity';
import Fire from '#assets/svg/Fire';
import Lock from '#assets/svg/Lock';
import Stop from '#assets/svg/Stop';
import { Entity } from '#Composer/composer.types';
import { useTypedSelector } from '#store';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { FC, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';

import { ActivityProps } from '../types';
import Temp from './EmojiComponent';
import { Wrapper } from './styles';

const toolbarOptions = {
  options: ['inline', 'list', 'emoji'],
  inline: { options: ['bold', 'underline'] },
  list: { options: ['unordered', 'ordered'] },
  emoji: {
    emojis: [CheckCircle, Danger, Electricity, Fire, Delete, Lock, Stop],
    component: Temp,
  },
};

const InstructionActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentBlock, setContentBlock] = useState(
    htmlToDraft(activity.data.text),
  );

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
    <Wrapper isJobView={entity === Entity.JOB}>
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

          console.log('value :: ', value);
        }}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
      />
    </Wrapper>
  );
};

export default InstructionActivity;
