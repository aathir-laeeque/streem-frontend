import { actionSpreader } from '#store';
import { Activity } from '../types';

export enum SignatureAction {
  UPLOAD_FILE = '@@composer/activity/signature/UPLOAD_FILE',
}

export const uploadFile = ({
  formData,
  activity,
}: {
  formData: FormData;
  activity: Activity;
}) => actionSpreader(SignatureAction.UPLOAD_FILE, { formData, activity });
