import { EmojiComponent } from '#components';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { emojis } from '#utils/constants';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { FC, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ParameterProps } from '../types';
import { Wrapper } from './styles';

const toolbarOptions = {
  options: ['inline', 'list', 'emoji'],
  inline: { options: ['bold', 'underline'] },
  list: { options: ['unordered', 'ordered'] },
  emoji: {
    emojis,
    component: EmojiComponent,
  },
};

const InstructionParameter: FC<ParameterProps> = ({ parameter }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentBlock, setContentBlock] = useState(htmlToDraft(parameter.data.text));

  useEffect(() => {
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [contentBlock]);

  useEffect(() => {
    setContentBlock(htmlToDraft(parameter.data.text));
  }, [parameter]);

  return (
    <Wrapper isJobView={entity === Entity.JOB}>
      <div className="parameter-header">Write your instruction/notes</div>

      <Editor
        editorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={toolbarOptions}
        onBlur={() => {
          const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));

          console.log('value :: ', value);
        }}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
        data-id={parameter.id}
        data-type={parameter.type}
      />
    </Wrapper>
  );
};

export default InstructionParameter;
