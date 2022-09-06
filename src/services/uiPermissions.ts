import { store } from '../App';
import { get } from 'lodash';

export enum roles {
  ACCOUNT_OWNER = 'ACCOUNT_OWNER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FACILITY_ADMIN = 'FACILITY_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
  CHECKLIST_PUBLISHER = 'CHECKLIST_PUBLISHER',
}

export enum RoleIdByName {
  ACCOUNT_OWNER = '1',
  SYSTEM_ADMIN = '3',
  FACILITY_ADMIN = '2',
  SUPERVISOR = '4',
  OPERATOR = '5',
  CHECKLIST_PUBLISHER = '6',
}

const uiPermissions: Record<string, any> = {
  sidebar: {
    inbox: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    jobs: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER, roles.SUPERVISOR],
    ontology: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    checklists: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
  },
  header: {
    usersAndAccess: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
    ],
  },
  usersAndAccess: {
    activeUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
    ],
    archivedUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
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
    ],
  },
  checklists: {
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    revision: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    archive: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    release: [roles.ACCOUNT_OWNER, roles.CHECKLIST_PUBLISHER],
    createJob: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
    ],
    prototype: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.CHECKLIST_PUBLISHER,
      roles.SUPERVISOR,
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
  home: [
    roles.ACCOUNT_OWNER,
    roles.FACILITY_ADMIN,
    roles.CHECKLIST_PUBLISHER,
    roles.SUPERVISOR,
    roles.OPERATOR,
  ],
  ontology: {
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    edit: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
    archive: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER],
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
