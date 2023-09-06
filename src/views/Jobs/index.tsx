import AuditLogs from '#JobComposer/JobAuditLogs';
import Job from '#views/Job';
import { Router } from '@reach/router';
import React, { FC } from 'react';
import Assignments from './Assignment';
import ListView from './ListView';
import JobSummary from './Summary';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />
    <Job path="/:id" />
    <Assignments path="/:jobId/assignments" />
    <AuditLogs path="/:jobId/activities" />
    <JobSummary path="/:jobId/summary" />
  </Router>
);

export default JobsView;
