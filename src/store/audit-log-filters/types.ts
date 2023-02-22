import { setAuditLogFilters, clearAuditLogFilters, setPdfColumns } from './action';

export interface AuditLogsFiltersState {
  readonly filters: string;
  readonly columns: any[];
}

export enum AuditLogsFiltersAction {
  SET_FILTERS = '@@auditLogsFilters/SET_FILTERS',
  CLEAR_FILTRES = '@@auditLogsFilters/CLEAR_FILTRES',
  SET_COLUMNS = '@@auditLogsFilters/SET_COLUMNS',
}

export type AuditLogFiltersActionType = ReturnType<
  typeof setAuditLogFilters | typeof clearAuditLogFilters | typeof setPdfColumns
>;
