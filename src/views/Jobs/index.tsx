import Composer from '#JobComposer';
import { Entity } from '#JobComposer/composer.types';
import ActivityView from '#JobComposer/JobActivity';
import { Router } from '@reach/router';
import React, { FC } from 'react';
import Assignments from './Assignment';
import NewListView from './NewListView';
import JobSummary from './Summary';
import { JobsViewProps } from './types';

const JobsView: FC<JobsViewProps> = () => (
  <Router>
    <NewListView path="/" />

    <Composer path="/:id" entity={Entity.JOB} />

    <Assignments path="/:jobId/assignments" />

    <ActivityView path="/:jobId/activites" />

    <JobSummary path="/:jobId/summary" />
  </Router>
);

export default JobsView;
