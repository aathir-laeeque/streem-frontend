import { store } from '../App';
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
        nonEditable: [roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
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
    revision: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    archive: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    release: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER],
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
    importExport: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
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
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
    actions: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
  },
};

const checkPermission = (keys: string[]) => {
  const {
    auth: { roles: authRoles },
  } = store.getState();
  const check = get(uiPermissions, keys, false);
  if (check && authRoles && authRoles.length) {
    return authRoles.some((role: string) => check.includes(role));
  }

  return false;
};

export default checkPermission;
