import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';

interface AddEditViewProps extends RouteComponentProps {
  checklistId?: string | number;
}

const AddEditView: FC<AddEditViewProps> = ({ checklistId }) => {
  console.log('checklistId frmo addedit view :: ', checklistId);

  return <div>this is the checklist add edit view component</div>;
};

export default AddEditView;
