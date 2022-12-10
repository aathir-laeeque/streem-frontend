import React, { FC } from 'react';
import ListView from './ListView';

import { ReportsViewProps } from './types';

const ReportsView: FC<ReportsViewProps> = () => (
  <div>
    <ListView path="/" />
  </div>
);

export default ReportsView;
