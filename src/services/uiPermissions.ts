// import { useTypedSelector } from '#store';
import { store } from '../App';
import { get } from 'lodash';

enum roles {
  ACCOUNT_OWNER = 'ACCOUNT_OWNER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FACILITY_ADMIN = 'FACILITY_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
}

const uiPermissions: Record<string, any> = {
  sidebar: {
    inbox: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    jobs: [
      roles.ACCOUNT_OWNER,
      roles.FACILITY_ADMIN,
      roles.SUPERVISOR,
      roles.OPERATOR,
    ],
    checklists: [roles.ACCOUNT_OWNER, roles.FACILITY_ADMIN],
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
  // const authRoles = [];
  // authRoles[0] = roles.FACILITY_ADMIN;
  const check = get(uiPermissions, keys, false);
  if (check && authRoles && authRoles[0]) {
    return check.includes(authRoles[0]);
  }

  return false;
};

export default checkPermission;
