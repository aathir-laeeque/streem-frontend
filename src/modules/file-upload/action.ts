import { actionSpreader } from '#store';
import { FileUploadAction, UploadFileArgs } from './types';

export const uploadFile = ({ formData, activity }: UploadFileArgs) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE, {
    formData,
    activity,
  });