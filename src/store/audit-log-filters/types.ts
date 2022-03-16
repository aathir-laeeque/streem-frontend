import { setAuditLogFilters, clearAuditLogFilters } from './action';

export interface AuditLogsFiltersState {
  readonly filters: string;
}

export enum AuditLogsFiltersAction {
  SET_FILTERS = '@@auditLogsFilters/SET_FILTERS',
  CLEAR_FILTRES = '@@auditLogsFilters/CLEAR_FILTRES',
}

export type AuditLogFiltersActionType = ReturnType<
  typeof setAuditLogFilters | typeof clearAuditLogFilters
>;
