import { actionSpreader } from '#store';
import { FileUploadAction, UploadFileType } from './types';

export const uploadFile = ({ formData, parameter, isCorrectingError }: UploadFileType) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE, {
    formData,
    parameter,
    isCorrectingError,
  });
