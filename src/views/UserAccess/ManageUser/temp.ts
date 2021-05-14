import { RoleType, PermissionType } from '../types';

export const roles: RoleType[] = [
  {
    id: '1',
    name: 'Account Owner',
    permissions: {
      'Create and manage Checklists': true,
      'View existing Checklists': true,
      'View Prototypes': true,
      'Review and Approve Checklists': true,
      'Create and Assign Jobs': true,
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'Complete a Job with Exception': true,
      'Make Corrections in completed Tasks': true,
      'Manage Task Exceptions': true,
      'Manage Users and Permissions': true,
      'View existing Users': true,
      'Manage Facility Access': true,
      'View User’s Session Activity': true,
    },
  },
  {
    id: '2',
    name: 'Facility Admin',
    permissions: {
      'Create and manage Checklists': true,
      'View existing Checklists': true,
      'View Prototypes': true,
      'Review and Approve Checklists': true,
      'Create and Assign Jobs': true,
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'Complete a Job with Exception': true,
      'Make Corrections in completed Tasks': true,
      'Manage Task Exceptions': true,
      'View existing Users': true,
      'View User’s Session Activity': true,
    },
  },
  {
    id: '3',
    name: 'System Admin',
    permissions: {
      'Manage Users and Permissions': true,
      'View existing Users': true,
      'Manage Facility Access': true,
      'View User’s Session Activity': true,
    },
  },
  {
    id: '4',
    name: 'Supervisor',
    permissions: {
      'Create and Assign Jobs': true,
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'Complete a Job with Exception': true,
      'Make Corrections in completed Tasks': true,
      'Manage Task Exceptions': true,
    },
  },
  {
    id: '5',
    name: 'Operator',
    permissions: {
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'Make Corrections in completed Tasks': true,
    },
  },
];

export const permissions: PermissionType[] = [
  {
    id: 1,
    name: 'Checklisting Features',
    permissions: [
      'Create and manage Checklists',
      'View existing Checklists',
      'View Prototypes',
      'Review and Approve Checklists',
    ],
  },
  {
    id: 2,
    name: 'Job Features',
    permissions: [
      'Create and Assign Jobs',
      'Execute and Complete Jobs',
      'Print Jobs',
      'View Job Activity',
      'Complete a Job with Exception',
      'Make Corrections in completed Tasks',
      'Manage Task Exceptions',
    ],
  },
  {
    id: 3,
    name: 'Administrative Features',
    permissions: [
      'Manage Users and Permissions',
      'View existing Users',
      'Manage Facility Access',
      'View User’s Session Activity',
    ],
  },
];
