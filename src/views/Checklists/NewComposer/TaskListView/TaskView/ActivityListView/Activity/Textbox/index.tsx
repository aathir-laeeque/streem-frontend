import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC, useState } from 'react';

import { ActivityProps } from '../types';

const TextboxActivity: FC<ActivityProps> = ({ activity }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const [stateActivity, setStateActivity] = useState(activity);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <div>
      <div className="new-form-field">
        <label className="new-form-field-label">User Comments Box</label>
        <textarea
          className="new-form-field-textarea"
          placeholder="User will write comments here"
          value={stateActivity?.data?.value}
          rows={4}
          disabled={isEditing}
          onChange={(e) => {
            {
              /* TODO: integrate update action for activity and execute action */
            }

            setStateActivity({
              ...stateActivity,
              data: { value: e.target.value },
            });
          }}
        />
      </div>
    </div>
  );
};

export default TextboxActivity;
