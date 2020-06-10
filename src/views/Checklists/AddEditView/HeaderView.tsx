import React, { FC } from 'react';

import { Button } from '../../../components';
import { AutoSaveText, Header, HeaderItem } from './styles';

const HeaderView: FC = () => (
  <Header>
    <HeaderItem>Stages</HeaderItem>
    <AutoSaveText>All changes saved automatically</AutoSaveText>
    <Button>Publish Checlist</Button>
  </Header>
);

export default HeaderView;
