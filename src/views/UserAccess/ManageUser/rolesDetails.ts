import { RoleIdByName } from '#services/uiPermissions';

enum PermissionCategories {
  CHECKLIST_FEATURES = 'Checklisting Features',
  JOB_FEATURES = 'Job Features',
  ADMINISTRATIVE_FEATURES = 'Administrative Features',
  ONTOLOGY_FEATURES = 'Ontology',
  GLOBAL_PORTAL_FEATURES = 'Global Portal',
}

enum ChecklistFeatures {
  CREATE_UNIT_LEVEL_CHECKLISTS = 'Create Unit-Level Checklists',
  VIEW_EXISTING_UNIT_LEVEL_CHECKLISTS = 'View existing Unit-Level Checklists',
  VIEW_UNIT_LEVEL_PROTOTYPES = 'View Unit-Level Prototypes',
  REVIEW_AND_APPROVE_UNIT_LEVEL_CHECKLISTS = 'Review and Approve Unit-Level Checklists',
  RELEASE_UNIT_LEVEL_CHECKLISTS = 'Release Unit-Level Checklists',
  REVISE_AND_ARCHIVE_UNIT_LEVEL_CHECKLISTS = 'Revise and Archive Unit-Level Checklists',
}

enum JobFeatures {
  CREATE_AND_ASSIGN_JOBS = 'Create and Assign Jobs',
  EXECUTE_AND_COMPLETE_JOBS = 'Execute and Complete Jobs',
  PRINT_JOBS = 'Print Jobs',
  VIEW_JOBS_AND_JOB_ACTIVITY = 'View Jobs and Job Activity',
  COMPLETE_JOB_WITH_EXCEPTION = 'Complete a Job with Exception',
  MAKE_CORRECTIONS_IN_COMPLETED_TASK = 'Make Corrections in completed Tasks',
  MANAGE_TASK_EXCEPTIONS = 'Manage Task Exceptions',
}

enum AdministrativeFeatures {
  MANAGE_USERS_AND_PERMISSIONS = 'Manage Users and Permissions',
  VIEW_EXISTING_USERS = 'View existing Users',
  MANAGE_FACILITY_ACCESS = 'Manage Facility Access',
  VIEW_USER_SESSION_ACTIVITY = 'View User’s Session Activity',
}

enum OntologyFeatures {
  VIEW_OBJECT_TYPES = 'View Object Types',
  CREATE_AND_UPDATE_OBJECTS = 'Create and Update Objects',
  VIEW_OBJECTS = 'View Objects',
}

enum GlobalPortalFeatures {
  ACCESS_GLOBAL_PORTAL = 'Access Global Portal',
  CREATE_GLOBAL_CHECKLISTS = 'Create Global Checklists',
  VIEW_GLOBAL_CHECKLISTS = 'View Global Checklists',
  SHARE_GLOBAL_CHECKLISTS_WITH_UNITS = 'Share Global Checklists with Units',
  REVIEW_AND_APPROVE_GLOBAL_CHECKLISTS = 'Review and Approve Global Checklists',
  RELEASE_GLOBAL_CHECKLISTS = 'Release Global Checklists',
  REVISE_AND_ARCHIVE_GLOBAL_CHECKLISTS = 'Revise and Archive Global Checklists',
}

export const rolesDetails = {
  [RoleIdByName.ACCOUNT_OWNER]: {
    name: 'Account Owner',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: Object.values(ChecklistFeatures).map((v) => v),
      [PermissionCategories.JOB_FEATURES]: Object.values(JobFeatures).map((v) => v),
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: Object.values(AdministrativeFeatures).map(
        (v) => v,
      ),
      [PermissionCategories.ONTOLOGY_FEATURES]: Object.values(OntologyFeatures).map((v) => v),
      [PermissionCategories.GLOBAL_PORTAL_FEATURES]: Object.values(GlobalPortalFeatures).map(
        (v) => v,
      ),
    },
  },
  [RoleIdByName.FACILITY_ADMIN]: {
    name: 'Facility Admin',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatures.CREATE_UNIT_LEVEL_CHECKLISTS,
        ChecklistFeatures.VIEW_EXISTING_UNIT_LEVEL_CHECKLISTS,
        ChecklistFeatures.VIEW_UNIT_LEVEL_PROTOTYPES,
        ChecklistFeatures.REVIEW_AND_APPROVE_UNIT_LEVEL_CHECKLISTS,
        ChecklistFeatures.REVISE_AND_ARCHIVE_UNIT_LEVEL_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: Object.values(JobFeatures).map((v) => v),
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
      [PermissionCategories.ONTOLOGY_FEATURES]: Object.values(OntologyFeatures).map((v) => v),
    },
  },
  [RoleIdByName.CHECKLIST_PUBLISHER]: {
    name: 'Checklist Publisher',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: Object.values(ChecklistFeatures).map((v) => v),
      [PermissionCategories.JOB_FEATURES]: Object.values(JobFeatures).map((v) => v),
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
      [PermissionCategories.ONTOLOGY_FEATURES]: Object.values(OntologyFeatures).map((v) => v),
    },
  },
  [RoleIdByName.SYSTEM_ADMIN]: {
    name: 'System Admin',
    permissions: {
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: Object.values(AdministrativeFeatures).map(
        (v) => v,
      ),
    },
  },
  [RoleIdByName.SUPERVISOR]: {
    name: 'Supervisor',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatures.VIEW_EXISTING_UNIT_LEVEL_CHECKLISTS,
        ChecklistFeatures.VIEW_UNIT_LEVEL_PROTOTYPES,
        ChecklistFeatures.REVIEW_AND_APPROVE_UNIT_LEVEL_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: Object.values(JobFeatures).map((v) => v),
      [PermissionCategories.ONTOLOGY_FEATURES]: [
        OntologyFeatures.VIEW_OBJECT_TYPES,
        OntologyFeatures.VIEW_OBJECTS,
      ],
    },
  },
  [RoleIdByName.OPERATOR]: {
    name: 'Operator',
    permissions: {
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOBS_AND_JOB_ACTIVITY,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
      ],
      [PermissionCategories.ONTOLOGY_FEATURES]: [
        OntologyFeatures.VIEW_OBJECT_TYPES,
        OntologyFeatures.VIEW_OBJECTS,
      ],
    },
  },
  [RoleIdByName.GLOBAL_ADMIN]: {
    name: 'Global Admin',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatures.VIEW_EXISTING_UNIT_LEVEL_CHECKLISTS,
        ChecklistFeatures.VIEW_UNIT_LEVEL_PROTOTYPES,
      ],
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOBS_AND_JOB_ACTIVITY,
      ],
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
      [PermissionCategories.ONTOLOGY_FEATURES]: [
        OntologyFeatures.VIEW_OBJECT_TYPES,
        OntologyFeatures.VIEW_OBJECTS,
      ],
      [PermissionCategories.GLOBAL_PORTAL_FEATURES]: Object.values(GlobalPortalFeatures).map(
        (v) => v,
      ),
    },
  },
};
