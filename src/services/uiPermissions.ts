// import { useTypedSelector } from '#store';
import { store } from '../App';
import { get } from 'lodash';

export enum roles {
  ACCOUNT_OWNER = 'ACCOUNT_OWNER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FACILITY_ADMIN = 'FACILITY_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
}

export enum RoleIdByName {
  ACCOUNT_OWNER = '1',
  SYSTEM_ADMIN = '3',
  FACILITY_ADMIN = '2',
  SUPERVISOR = '4',
  OPERATOR = '5',
}

const uiPermissions: Record<string, any> = {
  sidebar: {
    inbox: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    jobs: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.SUPERVISOR],
    checklists: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN, roles.SUPERVISOR],
  },
  header: {
    usersAndAccess: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
    ],
  },
  usersAndAccess: {
    activeUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
    ],
    archivedUsers: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
    ],
    addNewUser: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
    listViewActions: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
    editAccountOwner: [roles.ACCOUNT_OWNER],
    selectedUser: {
      form: {
        editable: [roles.ACCOUNT_OWNER, roles.SYSTEM_ADMIN],
        nonEditable: [roles.FACILITY_ADMIN],
      },
    },
    sessionActivity: [
      roles.ACCOUNT_OWNER,
      roles.SYSTEM_ADMIN,
      roles.FACILITY_ADMIN,
    ],
  },
  checklists: {
    create: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
    revision: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
    archive: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
    release: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
  },
  inbox: {
    completeWithException: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.SUPERVISOR,
    ],
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
