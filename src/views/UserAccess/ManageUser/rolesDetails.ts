import { RoleIdByName } from '#services/uiPermissions';

enum PermissionCategories {
  CHECKLIST_FEATURES = 'Checklisting Features',
  JOB_FEATURES = 'Job Features',
  ADMINISTRATIVE_FEATURES = 'Administrative Features',
}

enum ChecklistFeatues {
  CREATE_MANAGE_CHECKLISTS = 'Create and manage Checklists',
  VIEW_EXISTING_CHECKLISTS = 'View existing Checklists',
  VIEW_PROTOTYPES = 'View Prototypes',
  REVIEW_AND_APPROVE_CHECKLISTS = 'Review and Approve Checklists',
  RELEASE_PUBLISH_CHECKLISTS = 'Release and publish Checklists',
}

enum JobFeatures {
  CREATE_ASSIGN_JOBS = 'Create and Assign Jobs',
  EXECUTE_AND_COMPLETE_JOBS = 'Execute and Complete Jobs',
  PRINT_JOBS = 'Print Jobs',
  VIEW_JOB_ACTIVITY = 'View Job Activity',
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

export const rolesDetails = {
  [RoleIdByName.ACCOUNT_OWNER]: {
    name: 'Account Owner',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatues.CREATE_MANAGE_CHECKLISTS,
        ChecklistFeatues.VIEW_EXISTING_CHECKLISTS,
        ChecklistFeatues.VIEW_PROTOTYPES,
        ChecklistFeatues.REVIEW_AND_APPROVE_CHECKLISTS,
        ChecklistFeatues.RELEASE_PUBLISH_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.CREATE_ASSIGN_JOBS,
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOB_ACTIVITY,
        JobFeatures.COMPLETE_JOB_WITH_EXCEPTION,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
        JobFeatures.MANAGE_TASK_EXCEPTIONS,
      ],
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.MANAGE_USERS_AND_PERMISSIONS,
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.MANAGE_FACILITY_ACCESS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
    },
  },
  [RoleIdByName.FACILITY_ADMIN]: {
    name: 'Facility Admin',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatues.CREATE_MANAGE_CHECKLISTS,
        ChecklistFeatues.VIEW_EXISTING_CHECKLISTS,
        ChecklistFeatues.VIEW_PROTOTYPES,
        ChecklistFeatues.REVIEW_AND_APPROVE_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.CREATE_ASSIGN_JOBS,
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOB_ACTIVITY,
        JobFeatures.COMPLETE_JOB_WITH_EXCEPTION,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
        JobFeatures.MANAGE_TASK_EXCEPTIONS,
      ],
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
    },
  },
  [RoleIdByName.CHECKLIST_PUBLISHER]: {
    name: 'Checklist Publisher',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatues.CREATE_MANAGE_CHECKLISTS,
        ChecklistFeatues.VIEW_EXISTING_CHECKLISTS,
        ChecklistFeatues.VIEW_PROTOTYPES,
        ChecklistFeatues.REVIEW_AND_APPROVE_CHECKLISTS,
        ChecklistFeatues.RELEASE_PUBLISH_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.CREATE_ASSIGN_JOBS,
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOB_ACTIVITY,
        JobFeatures.COMPLETE_JOB_WITH_EXCEPTION,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
        JobFeatures.MANAGE_TASK_EXCEPTIONS,
      ],
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
    },
  },
  [RoleIdByName.SYSTEM_ADMIN]: {
    name: 'System Admin',
    permissions: {
      [PermissionCategories.ADMINISTRATIVE_FEATURES]: [
        AdministrativeFeatures.MANAGE_USERS_AND_PERMISSIONS,
        AdministrativeFeatures.VIEW_EXISTING_USERS,
        AdministrativeFeatures.MANAGE_FACILITY_ACCESS,
        AdministrativeFeatures.VIEW_USER_SESSION_ACTIVITY,
      ],
    },
  },
  [RoleIdByName.SUPERVISOR]: {
    name: 'Supervisor',
    permissions: {
      [PermissionCategories.CHECKLIST_FEATURES]: [
        ChecklistFeatues.VIEW_EXISTING_CHECKLISTS,
        ChecklistFeatues.VIEW_PROTOTYPES,
        ChecklistFeatues.REVIEW_AND_APPROVE_CHECKLISTS,
      ],
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.CREATE_ASSIGN_JOBS,
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOB_ACTIVITY,
        JobFeatures.COMPLETE_JOB_WITH_EXCEPTION,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
        JobFeatures.MANAGE_TASK_EXCEPTIONS,
      ],
    },
  },
  [RoleIdByName.OPERATOR]: {
    name: 'Operator',
    permissions: {
      [PermissionCategories.JOB_FEATURES]: [
        JobFeatures.EXECUTE_AND_COMPLETE_JOBS,
        JobFeatures.PRINT_JOBS,
        JobFeatures.VIEW_JOB_ACTIVITY,
        JobFeatures.MAKE_CORRECTIONS_IN_COMPLETED_TASK,
      ],
    },
  },
};
