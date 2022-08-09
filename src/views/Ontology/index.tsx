import { RouteComponentProps, Router } from '@reach/router';
import React, { FC } from 'react';
import OntologyContent from './OntologyContent';
import ObjectTypesContent from './ObjectTypes';
import ObjectsContent from './Objects';

const OntologyView: FC<RouteComponentProps> = () => (
  <Router>
    <OntologyContent path="/*" />
    <ObjectTypesContent path="object-types/:id" />
    <ObjectsContent path="object-types/:objectTypeId/objects/:id" />
  </Router>
);

export default OntologyView;
