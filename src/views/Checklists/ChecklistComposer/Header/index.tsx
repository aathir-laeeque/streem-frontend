import { Button } from '#components';

import React, { FC } from 'react';

import { Wrapper } from './styles';

const Header: FC = () => (
  <Wrapper>
    <div className="header-item">Stages</div>
    <span className="auto-save-text">All changes saved automatically</span>
    <Button>Publish Checklist</Button>
  </Wrapper>
);

export default Header;
