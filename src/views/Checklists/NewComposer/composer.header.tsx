import { Button } from '#components';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ComposerState } from './composer.types';

const Wrapper = styled.div`
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  grid-area: header;
  justify-content: space-between;
  z-index: 1;

  .header-item {
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.75;
    letter-spacing: normal;
    color: #1d84ff;
    border-bottom: 2px solid #1d84ff;
    padding: 18px 32px;
  }

  .auto-save-text {
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    line-height: 0.75;
    margin-left: auto;
    margin-right: 16px;
  }
`;

const Header: FC = () => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditingChecklist = composerState === ComposerState.EDIT;

  return (
    <Wrapper>
      <div className="header-item">Stages</div>
      {/* <span className="auto-save-text">All changes saved automatically</span> */}
      {isEditingChecklist ? <Button>Publish Checklist</Button> : null}
      {/* <Button>Complete Job</Button> */}
    </Wrapper>
  );
};

export default Header;
