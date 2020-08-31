import { useTypedSelector } from '#store';
import { Entity } from '#Composer/types';
import React, { FC } from 'react';

import { ActivityProps } from '../types';

const TextboxActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  if (entity === Entity.JOB) {
    return (
      <div>
        <div className="new-form-field">
          <label className="new-form-field-label">User Comments Box</label>
          <textarea
            className="new-form-field-textarea"
            placeholder="User will write comments here"
            value={activity?.data?.value}
            rows={4}
            onChange={(e) => console.log('value :: ', e.target.value)}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TextboxActivity;
