import { RouteComponentProps } from '@reach/router';

export type ChecklistViewProps = RouteComponentProps;

// checklist interfaces
enum InteractionType {
  MATERIAL = 'material',
  INSTRUCTION = 'instruction',
  MEDIA_IMAGES = 'images',
  MULTIPLE_CHOICE = 'multiplechoice',
  YES_NO = 'yesno',
  CEHCKLIST = 'checklist',
  SHOULD_BE = 'shouldbe',
  COMMENT = 'comment',
  SIGNATURE = 'signature',
}

interface Interaction {
  type: InteractionType;
  id: string | number;
  name: string;
  data: any[];
}

interface Step {
  code: string;
  id: string | number;
  name: string;
  hasStop?: boolean;
  timed?: boolean;
  dueOn?: Date;
  interactions: Interaction[] | [];
}

interface Stage {
  code: string;
  id: string | number;
  name: string;
  steps: Step[] | [];
}

interface Checklist {
  code: string;
  id: string | number;
  name: string;
  stage: Stage[] | [];
  version: number | null;
  archived: boolean;
}
