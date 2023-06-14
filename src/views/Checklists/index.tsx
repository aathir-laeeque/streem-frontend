import Composer from '#PrototypeComposer';
import AuditLogs from '#PrototypeComposer/ChecklistAuditLogs';
import { ComposerEntity } from '#PrototypeComposer/types';
import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';
import ListView from './ListView';
import NewPrototype from './NewPrototype';
import Assignment from './Assignment';
import Automation from './Automation';
import JobLogs from './JobLogs';
import JobsListView from '#views/Jobs/ListView';
import Scheduler from './Schedular/index';
import Permissions from '#views/Checklists/Permissions';

const ChecklistView: FC<RouteComponentProps> = () => (
  <Router>
    <ListView path="/" />
    <JobsListView path="/jobs" />
    <Composer path="/:id" entity={ComposerEntity.CHECKLIST} />
    <AuditLogs path="/:id/activities" />
    <Assignment path="/:id/assignment" />
    <Automation path="/:id/automation" />
    <JobLogs path="/:id/logs" />
    <NewPrototype path="/prototype" />
    <Scheduler path="/:id/scheduler" />
    <Permissions path="/:id/permissions" />
  </Router>
);

export default ChecklistView;
