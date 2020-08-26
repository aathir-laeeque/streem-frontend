import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC, useState } from 'react';

import { ActivityProps } from '../types';

const TextboxActivity: FC<ActivityProps> = ({ activity }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <div>
      <div className="new-form-field">
        <label className="new-form-field-label">User Comments Box</label>
        <textarea
          className="new-form-field-textarea"
          placeholder="User will write comments here"
          value={`activity`?.data?.value}
          rows={4}
          disabled={isEditing}
          onChange={(e) => {}}
        />
      </div>
    </div>
  );
};

export default TextboxActivity;
