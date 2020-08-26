import { ActivityType } from '#views/Checklists/NewComposer/checklist.types';
import { ArrowRightAlt } from '@material-ui/icons';
import React from 'react';
import Select from 'react-select';

import { customSelectStyles } from './ActivityListView/Activity/commonStyles';
import { FooterProps } from './types';
import { FooterWrapper } from './styles';

const Footer: FC<FooterProps> = ({ isEditingTemplate, isTaskSkipable }) => (
  <FooterWrapper isEditing={isEditingTemplate}>
    <Select
      className="add-new-activity"
      placeholder="Add activity"
      options={Object.values(ActivityType).map((key) => ({
        label: ActivityType[key],
        value: key,
      }))}
      styles={customSelectStyles}
      onChange={(option) => console.log('option on change :: ', option)}
    />

    <button className="complete-task">
      Complete Task <ArrowRightAlt className="icon" />
    </button>

    <button className="skip-task">
      {isTaskSkipable ? 'Skip the task' : 'Force close task'}
    </button>
  </FooterWrapper>
);

export default Footer;
