import { Checklist } from '../../types';
export interface SideBarProps {
  selectedChecklist: Checklist | null;
  closeNav: () => void;
  sideBarOpen: boolean;
}
