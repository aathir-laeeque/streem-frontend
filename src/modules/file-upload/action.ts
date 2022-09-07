import { actionSpreader } from '#store';
import { FileUploadAction, UploadFileType } from './types';

export const uploadFile = ({ formData, activity, isCorrectingError }: UploadFileType) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE, {
    formData,
    activity,
    isCorrectingError,
  });
