import { PermissionType, RoleType } from './types';

export const roles: RoleType[] = [
  {
    id: 1,
    name: 'System Admin',
    permissions: {
      'Manage Users and Roles': true,
      'Manage Facility Access': true,
      'View User’s Session Activity': true,
      'Manage Application Security': true,
    },
  },
  {
    id: 2,
    name: 'Facility Admin',
    permissions: {
      'Create Checklists and Submit Versions': true,
      'View existing Checklists': true,
      'Archive and Unarchive Checklists': true,
      'View Checklist Activity': true,
      'Review and Approve Checklists': true,
      'Print Checklists': true,
      'View Checklist Reports & Analytics': true,
      'Create and Assign Jobs': true,
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'View Job Report & Analytics': true,
    },
  },
  {
    id: 3,
    name: 'Supervisor',
    permissions: {
      'View existing Checklists': true,
      'View Checklist Activity': true,
      'Review and Approve Checklists': true,
      'Print Checklists': true,
      'View Checklist Reports & Analytics': true,
      'Create and Assign Jobs': true,
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
      'View Job Report & Analytics': true,
    },
  },
  {
    id: 4,
    name: 'Operator',
    permissions: {
      'Execute and Complete Jobs': true,
      'Print Jobs': true,
      'View Job Activity': true,
    },
  },
];

export const permissions: PermissionType[] = [
  {
    id: 1,
    name: 'Checklist Management',
    permissions: [
      'Create Checklists and Submit Versions',
      'View existing Checklists',
      'Archive and Unarchive Checklists',
      'View Checklist Activity',
      'Review and Approve Checklists',
      'Print Checklists',
      'View Checklist Reports & Analytics',
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
      'View Job Report & Analytics',
    ],
  },
  {
    id: 3,
    name: 'Administrative Features',
    permissions: [
      'Manage Users and Roles',
      'Manage Facility Access',
      'View User’s Session Activity',
      'Manage Application Security',
    ],
  },
];
