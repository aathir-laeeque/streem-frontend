import { FeatureFlags } from '#views/Auth/types';
import { get } from 'lodash';

export enum roles {
  ACCOUNT_OWNER = 'ACCOUNT_OWNER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FACILITY_ADMIN = 'FACILITY_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
  CHECKLIST_PUBLISHER = 'PROCESS_PUBLISHER',
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
}

export enum RoleIdByName {
  ACCOUNT_OWNER = '1',
  SYSTEM_ADMIN = '3',
  FACILITY_ADMIN = '2',
  SUPERVISOR = '4',
  OPERATOR = '5',
  CHECKLIST_PUBLISHER = '6',
  GLOBAL_ADMIN = '7',
}

const uiPermissions: Record<string, any> = {
  globalSidebar: {
    inbox: [roles.ACCOUNT_OWNER],
    jobs: [roles.ACCOUNT_OWNER],
    checklists: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    ontology: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    reports: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
  },
  sidebar: {
    inbox: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    jobs: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.GLOBAL_ADMIN,
    ],
    checklists: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
      roles.GLOBAL_ADMIN,
    ],
    ontology: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
      roles.GLOBAL_ADMIN,
    ],
    reports: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
      roles.GLOBAL_ADMIN,
    ],
  },
  header: {
    usersAndAccess: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.GLOBAL_ADMIN,
    ],
  },
  usersAndAccess: {
    activeUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.GLOBAL_ADMIN,
    ],
    archivedUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.GLOBAL_ADMIN,
    ],
    addNewUser: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
    listViewActions: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
    editAccountOwner: [roles.ACCOUNT_OWNER],
    selectedUser: {
      form: {
        editable: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
        nonEditable: [roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER, roles.GLOBAL_ADMIN],
      },
    },
    sessionActivity: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.GLOBAL_ADMIN,
    ],
  },
  checklists: {
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    createGlobal: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    revision: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER, roles.FACILITY_ADMIN],
    archive: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER],
    archivePrototype: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER, roles.FACILITY_ADMIN],
    release: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER],
    recall: [roles.CHECKLIST_PUBLISHER, roles.FACILITY_ADMIN, roles.ACCOUNT_OWNER],
    recallGlobal: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    releaseGlobal: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    createJob: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    prototype: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.GLOBAL_ADMIN,
    ],
    importExport: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.GLOBAL_ADMIN,
    ],
  },
  trainedUsers: {
    edit: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER, roles.SUPERVISOR],
  },
  inbox: {
    completeWithException: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
  },
  jobs: {
    jobAnnotation: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
  },
  home: [
    roles.ACCOUNT_OWNER,
    roles.FACILITY_ADMIN,
    roles.CHECKLIST_PUBLISHER,
    roles.SUPERVISOR,
    roles.OPERATOR,
    roles.GLOBAL_ADMIN,
  ],
  ontology: {
    createObject: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
    editObject: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
    createObjectByAutomation: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    archiveObject: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
    createObjectType: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    editObjectType: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
    archiveObjectType: [roles.ACCOUNT_OWNER, roles.GLOBAL_ADMIN],
  },
  scheduler: {
    create: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
    actions: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
  },
  approvals: {
    view: [roles.ACCOUNT_OWNER, roles.SUPERVISOR, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
  },
  jobLogsViews: {
    create: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.GLOBAL_ADMIN,
      roles.SYSTEM_ADMIN,
    ],
    edit: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.GLOBAL_ADMIN,
      roles.SYSTEM_ADMIN,
    ],
  },
  plannedVariation: {
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
  },
};

const checkPermission = (keys: string[]) => {
  const {
    auth: { roles: authRoles },
  } = window.store.getState();
  const check = get(uiPermissions, keys, false);
  if (check && authRoles && authRoles.length) {
    return authRoles.some((role: string) => check.includes(role));
  }

  return false;
};

export const isFeatureAllowed = (feature: keyof FeatureFlags) => {
  const {
    auth: { features },
  } = window.store.getState();
  return features && features[feature];
};

export default checkPermission;
