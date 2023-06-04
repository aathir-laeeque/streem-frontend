import Composer from '#JobComposer';
import { Entity } from '#JobComposer/composer.types';
import AuditLogs from '#JobComposer/JobAuditLogs';
import { Router } from '@reach/router';
import React, { FC } from 'react';
import Assignments from './Assignment';
import ListView from './ListView';
import JobSummary from './Summary';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <ListView path="/" />
    <Composer path="/:id" entity={Entity.JOB} />
    <Assignments path="/:jobId/assignments" />
    <AuditLogs path="/:jobId/activities" />
    <JobSummary path="/:jobId/summary" />
  </Router>
);

export default JobsView;
