import React, { FC } from 'react';

import JobHeaderButtons from './JobHeaderButtons';
import Wrapper from './styles';

const Header: FC = () => {
  return (
    <Wrapper>
      <div className="header-item">Stages</div>

      <span className="auto-save-text">All changes saved</span>

      <JobHeaderButtons />
    </Wrapper>
  );
};

export default Header;
