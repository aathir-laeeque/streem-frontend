import { Properties } from '#store/properties/types';
import { Checklist } from '../../types';
export interface SideBarProps {
  selectedChecklist: Checklist | null;
  closeNav: () => void;
  sideBarOpen: boolean;
  properties: Properties;
}
