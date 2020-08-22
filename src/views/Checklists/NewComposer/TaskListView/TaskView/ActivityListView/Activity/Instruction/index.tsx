import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const InstructionActivity: FC<ActivityProps> = ({ activity }) => {
  return (
    <Wrapper>
      <div className="activity-header">Write your instruction/notes</div>

      <Editor />
    </Wrapper>
  );
};

export default InstructionActivity;
