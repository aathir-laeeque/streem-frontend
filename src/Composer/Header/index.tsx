import { Entity } from '#Composer/composer.types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import JobHeaderButtons from './JobHeaderButtons';
import Wrapper from './styles';

const Header: FC = () => {
  const { entity } = useTypedSelector((state) => state.composer);

  const isEntityChecklist = entity === Entity.CHECKLIST;

  return (
    <Wrapper>
      <div className="header-item">Stages</div>

      <span className="auto-save-text">All changes saved</span>

      {isEntityChecklist ? null : <JobHeaderButtons />}
    </Wrapper>
  );
};

export default Header;
