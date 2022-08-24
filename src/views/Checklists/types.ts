import { AllChecklistStates } from '#PrototypeComposer/checklist.types';
import { Cardinality } from '#views/Ontology/types';

type ChecklistProperty = {
  id: string;
  name: string;
  value: string;
};

export type ChecklistRelation = {
  id: string;
  externalId: string;
  displayName: string;
  variables: {};
  objectTypeId: string;
  orderTree: number;
  target: {
    collection: string;
    urlPath: string;
    cardinality: Cardinality;
  };
  isMandatory: boolean;
};

// TODO REMOVE THESE TYPES AND USE FROM PROTOTYPE COMPOSER TYPES FILES.
export interface Checklist {
  archived: boolean;
  code: string;
  id: string;
  name: string;
  noOfJobs: number;
  properties: ChecklistProperty[];
  state: AllChecklistStates;
  version: number | null;
  relations: ChecklistRelation[];
}
