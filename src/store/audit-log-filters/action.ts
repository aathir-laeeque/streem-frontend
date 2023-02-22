import { actionSpreader } from '#store/helpers';
import { AuditLogsFiltersAction } from './types';

export const setAuditLogFilters = (payload: string) =>
  actionSpreader(AuditLogsFiltersAction.SET_FILTERS, payload);

export const setPdfColumns = (payload: any[]) =>
  actionSpreader(AuditLogsFiltersAction.SET_COLUMNS, payload);

export const clearAuditLogFilters = () => actionSpreader(AuditLogsFiltersAction.CLEAR_FILTRES);
