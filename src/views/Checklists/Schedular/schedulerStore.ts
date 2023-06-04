import { generateActions } from '#store/helpers';
import { DEFAULT_PAGINATION } from '#utils/constants';
import { EntityBaseState } from '#views/Ontology/types';
import { Pageable } from '#utils/globalTypes';

//TODO: types
const actions = {
  saveScheduler: { data: {} as SchedulerType, handleClose: {} as () => void },
  saveSchedulerError: {} as any,
  saveSchedulerSuccess: { data: {} as SchedulerType },
  fetchSchedulers: { params: {} as SchedulerType },
  fetchSchedulersSuccess: { data: {} as SchedulerType, pageable: {} as Pageable | null },
  archiveScheduler: { schedularId: '', reason: '', setFormErrors: {} as any },
  updateSchedulerList: { id: '' },
  fetchSchedulersVersionHistory: { schedularId: '' },
  modifyScheduler: { schedularId: '', data: {} as SchedulerType, handleClose: {} as () => void },
  modifySchedulerSuccess: { id: '', data: {} as SchedulerType },
  fetchSchedulersVersionHistorySuccess: {
    data: {} as SchedulerType,
  },
};

const { actions: schedulerActions, actionsEnum: SchedulerActionsEnum } = generateActions(
  actions,
  '@@leucine/process/entity/scheduler/',
);

type SchedulerActionsType = ReturnType<typeof schedulerActions[keyof typeof schedulerActions]>;

const initialState: SchedulerState = {
  activeLoading: true,
  listLoading: true,
  list: [],
  pageable: DEFAULT_PAGINATION,
  // Active used for both version history and single scheduler data
  active: {},
};

export type SchedulerType = any;

export const SchedulerReducer = (
  state = initialState,
  action: SchedulerActionsType,
): SchedulerState => {
  switch (action.type) {
    case SchedulerActionsEnum.saveSchedulerSuccess:
      return { ...state, list: [action.payload, ...state.list] };
    case SchedulerActionsEnum.fetchSchedulersSuccess:
      return { ...state, list: action.payload.data, pageable: action.payload.pageable };

    case SchedulerActionsEnum.updateSchedulerList:
      return { ...state, list: state.list.filter((item: any) => item.id !== action.payload.id) };

    case SchedulerActionsEnum.fetchSchedulersVersionHistorySuccess:
      return { ...state, active: action.payload.data };

    case SchedulerActionsEnum.modifySchedulerSuccess:
      const { id, data } = action.payload;
      const listUpdated = state.list.filter((item: any) => item.id !== id);
      return { ...state, list: [data, ...listUpdated] };

    default:
      return { ...state };
  }
};

export interface SchedulerState extends EntityBaseState<SchedulerType> {}

export default { schedulerActions, SchedulerActionsEnum };
