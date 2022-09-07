import { emojis } from '#utils/constants';
import { Error } from '@material-ui/icons';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch } from 'react-redux';
import { updateActivityApi, updateStoreActivity } from '../actions';
import ActivityLabelInput from '../ActivityLabelInput';
import { ActivityProps } from '../types';
import EmojiComponent from './EmojiComponent';
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

const InstructionActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);

  const activityError = activity.errors.find((error) => error.code === 'E422');

  useEffect(() => {
    const contentBlock = htmlToDraft(activity.data.text);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

      setEditorState(EditorState.createWithContent(contentState));

      if (componentLoaded) {
        dispatch(updateActivityApi(activity));
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
    if (!componentLoaded) {
      updateComponentLoaded(true);
    }
  }, [activity.data.text]);

  if (!editorState) return null;

  return (
    <Wrapper>
      {activityError ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}
      <div className="activity-header">Write your instruction/notes</div>

      <ActivityLabelInput activity={activity} />

      <Editor
        defaultEditorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName={`editor-class ${activityError && 'error'}`}
        toolbarClassName="toolbar-class"
        toolbar={toolbarOptions}
        onChange={debounce((value) => {
          value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
          dispatch(
            updateStoreActivity(
              editorState.getCurrentContent().getPlainText() ? value : '',
              activity.id,
              ['data', 'text'],
            ),
          );
        }, 500)}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
      />

      {activityError ? <div className="activity-error">{activityError?.message}</div> : null}
    </Wrapper>
  );
};

export default InstructionActivity;
